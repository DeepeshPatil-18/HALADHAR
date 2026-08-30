"""NDMA SACHET CAP alert feed integration"""

import httpx
import xml.etree.ElementTree as ET
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
import re


class SACHETSource:
    """
    Fetches disaster/weather alerts from NDMA SACHET CAP feeds.
    
    SACHET (System for Alert Coordination, Harmonization, Emergency Communication and Training)
    provides Common Alerting Protocol (CAP) based disaster alerts for India.
    """
    
    # SACHET RSS feed URL for Maharashtra
    # Note: As of implementation date, the public API endpoint structure is unclear
    # The documented endpoint format may have changed or require authentication
    # Official documentation: http://sachet.ndma.gov.in/docs/Integration_Guide_For_Agencies.pdf
    BASE_URL = "https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile"
    
    # Alternative: Direct CAP RSS feeds may be available at state-specific URLs
    # Format may be: https://sachet.ndma.gov.in/rss/{state}.xml
    # This implementation provides graceful degradation if SACHET is unavailable
    
    # CAP namespaces
    CAP_NS = {
        'cap': 'urn:oasis:names:tc:emergency:cap:1.2',
        'atom': 'http://www.w3.org/2005/Atom'
    }
    
    @staticmethod
    async def fetch_alerts(
        state: str = "maharashtra",
        district: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        Fetch active alerts from SACHET CAP feed.
        
        Args:
            state: State name (lowercase, default: maharashtra)
            district: District name for filtering (optional)
            
        Returns:
            List of alert dictionaries with parsed CAP data
        """
        try:
            # Fetch RSS feed
            feed_url = f"{SACHETSource.BASE_URL}?state={state.lower()}"
            
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(feed_url)
                response.raise_for_status()
                feed_xml = response.text
            
            # Parse RSS feed
            alerts = SACHETSource._parse_rss_feed(feed_xml)
            
            # Filter by district if specified
            if district:
                alerts = [
                    alert for alert in alerts
                    if SACHETSource._matches_district(alert, district)
                ]
            
            # Filter only active alerts
            now = datetime.utcnow()
            active_alerts = [
                alert for alert in alerts
                if alert.get('expires') and 
                datetime.fromisoformat(alert['expires'].replace('Z', '+00:00')) > now
            ]
            
            return active_alerts
            
        except httpx.HTTPError as e:
            # If SACHET feed is unavailable, return empty list (graceful degradation)
            print(f"SACHET feed error: {str(e)}")
            return []
        except Exception as e:
            print(f"Error parsing SACHET alerts: {str(e)}")
            return []
    
    @staticmethod
    def _parse_rss_feed(feed_xml: str) -> List[Dict[str, Any]]:
        """Parse SACHET RSS feed and extract alert links."""
        try:
            root = ET.fromstring(feed_xml)
            alerts = []
            
            # Find all RSS items (each contains a CAP message link)
            items = root.findall('.//item')
            
            for item in items:
                link = item.find('link')
                if link is not None and link.text:
                    # Each RSS item links to a CAP XML message
                    # For now, we'll parse basic info from the RSS item itself
                    alert = SACHETSource._parse_rss_item(item)
                    if alert:
                        alerts.append(alert)
            
            return alerts
            
        except ET.ParseError as e:
            print(f"XML parse error: {str(e)}")
            return []
    
    @staticmethod
    def _parse_rss_item(item: ET.Element) -> Optional[Dict[str, Any]]:
        """Parse a single RSS item into alert dictionary."""
        try:
            title = item.find('title')
            description = item.find('description')
            pub_date = item.find('pubDate')
            link = item.find('link')
            
            if not title or not title.text:
                return None
            
            # Extract basic alert info from RSS item
            alert_title = title.text.strip()
            alert_desc = description.text.strip() if description is not None and description.text else ""
            
            # Parse severity and event type from title
            severity = SACHETSource._extract_severity(alert_title)
            event_type = SACHETSource._extract_event_type(alert_title)
            
            # Extract location from description or title
            location = SACHETSource._extract_location(alert_title + " " + alert_desc)
            
            # Parse publication date
            published = None
            if pub_date is not None and pub_date.text:
                try:
                    # RSS date format: Wed, 27 Aug 2026 10:30:00 GMT
                    published = datetime.strptime(pub_date.text, '%a, %d %b %Y %H:%M:%S %Z')
                except:
                    pass
            
            # Set expiry (default: 24 hours from publication)
            expires = None
            if published:
                expires = (published + timedelta(hours=24)).isoformat() + 'Z'
            
            return {
                'id': link.text if link is not None and link.text else None,
                'title': alert_title,
                'description': alert_desc,
                'severity': severity,
                'event_type': event_type,
                'location': location,
                'published': published.isoformat() + 'Z' if published else None,
                'expires': expires,
                'source': 'NDMA SACHET'
            }
            
        except Exception as e:
            print(f"Error parsing RSS item: {str(e)}")
            return None
    
    @staticmethod
    def _extract_severity(text: str) -> str:
        """Extract severity level from alert text."""
        text_lower = text.lower()
        
        if any(word in text_lower for word in ['extreme', 'red', 'बेहद गंभीर', 'अत्यंत']):
            return 'Extreme'
        elif any(word in text_lower for word in ['severe', 'orange', 'गंभीर']):
            return 'Severe'
        elif any(word in text_lower for word in ['moderate', 'yellow', 'मध्यम']):
            return 'Moderate'
        elif any(word in text_lower for word in ['minor', 'green', 'हल्का']):
            return 'Minor'
        else:
            return 'Unknown'
    
    @staticmethod
    def _extract_event_type(text: str) -> str:
        """Extract event type from alert text."""
        text_lower = text.lower()
        
        if any(word in text_lower for word in ['rain', 'rainfall', 'बारिश', 'वर्षा']):
            return 'Heavy Rainfall'
        elif any(word in text_lower for word in ['thunder', 'lightning', 'आंधी', 'तूफान', 'बिजली']):
            return 'Thunderstorm'
        elif any(word in text_lower for word in ['flood', 'बाढ़']):
            return 'Flood'
        elif any(word in text_lower for word in ['heat', 'heatwave', 'गर्मी', 'लू']):
            return 'Heat Wave'
        elif any(word in text_lower for word in ['cold', 'winter', 'ठंड', 'सर्दी']):
            return 'Cold Wave'
        elif any(word in text_lower for word in ['wind', 'gale', 'हवा', 'आंधी']):
            return 'Strong Wind'
        elif any(word in text_lower for word in ['cyclone', 'storm', 'चक्रवात']):
            return 'Cyclone'
        elif any(word in text_lower for word in ['fog', 'कोहरा']):
            return 'Dense Fog'
        else:
            return 'Weather Alert'
    
    @staticmethod
    def _extract_location(text: str) -> str:
        """Extract location/district names from alert text."""
        # Common Maharashtra districts
        districts = [
            'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad',
            'Solapur', 'Ahmednagar', 'Kolhapur', 'Amravati', 'Nanded',
            'Sangli', 'Jalgaon', 'Akola', 'Latur', 'Dhule', 'Chandrapur',
            'Raigad', 'Satara', 'Ratnagiri', 'Yavatmal', 'Beed', 'Osmanabad',
            'Buldhana', 'Parbhani', 'Jalna', 'Wardha', 'Gondia', 'Bhandara',
            'Washim', 'Hingoli', 'Gadchiroli', 'Sindhudurg'
        ]
        
        found_districts = []
        for district in districts:
            if district.lower() in text.lower():
                found_districts.append(district)
        
        if found_districts:
            return ', '.join(found_districts)
        else:
            return 'Maharashtra'
    
    @staticmethod
    def _matches_district(alert: Dict[str, Any], district: str) -> bool:
        """Check if alert is relevant to the specified district."""
        location = alert.get('location', '').lower()
        district_lower = district.lower()
        
        # Check if district name appears in location
        return district_lower in location or location == 'maharashtra'
    
    @staticmethod
    def format_alert_for_ui(alert: Dict[str, Any]) -> Dict[str, Any]:
        """
        Format SACHET alert for KrishiMitra UI display.
        
        Returns:
            Dictionary with type, icon, title, description fields
        """
        # Map severity to icons
        severity_icons = {
            'Extreme': '🔴',
            'Severe': '🟠',
            'Moderate': '🟡',
            'Minor': '🟢',
            'Unknown': '⚠️'
        }
        
        # Map event types to icons
        event_icons = {
            'Heavy Rainfall': '🌧️',
            'Thunderstorm': '⛈️',
            'Flood': '🌊',
            'Heat Wave': '🌡️',
            'Cold Wave': '❄️',
            'Strong Wind': '💨',
            'Cyclone': '🌀',
            'Dense Fog': '🌫️',
            'Weather Alert': '⚠️'
        }
        
        severity = alert.get('severity', 'Unknown')
        event_type = alert.get('event_type', 'Weather Alert')
        
        # Choose icon (prefer event-specific, fallback to severity)
        icon = event_icons.get(event_type, severity_icons.get(severity, '⚠️'))
        
        # Format title
        title = f"{event_type} - {severity}"
        if severity == 'Extreme':
            title = f"{event_type} की गंभीर चेतावनी"
        elif severity == 'Severe':
            title = f"{event_type} चेतावनी"
        
        # Format description
        description = alert.get('description', '')
        location = alert.get('location', 'Maharashtra')
        
        if not description:
            description = f"{location} में {event_type.lower()} की संभावना है।"
        
        # Add validity info
        expires = alert.get('expires')
        if expires:
            try:
                expire_dt = datetime.fromisoformat(expires.replace('Z', '+00:00'))
                now = datetime.utcnow()
                hours_left = int((expire_dt - now).total_seconds() / 3600)
                if hours_left > 0 and hours_left < 48:
                    description += f" (अगले {hours_left} घंटों तक वैध)"
            except:
                pass
        
        return {
            'type': event_type.lower().replace(' ', '_'),
            'icon': icon,
            'title': title,
            'description': description,
            'severity': severity,
            'location': location,
            'source': 'NDMA SACHET'
        }
