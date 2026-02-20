import win32serviceutil
import win32service
import win32api
import win32con
import winerror
from typing import Dict, List, Optional
from datetime import datetime
import subprocess

class WindowsServiceManager:
    """God-level Windows Services Management Tool"""
    
    SERVICE_STATES = {
        win32service.SERVICE_STOPPED: 'STOPPED',
        win32service.SERVICE_START_PENDING: 'START_PENDING',
        win32service.SERVICE_STOP_PENDING: 'STOP_PENDING',
        win32service.SERVICE_RUNNING: 'RUNNING',
        win32service.SERVICE_CONTINUE_PENDING: 'CONTINUE_PENDING',
        win32service.SERVICE_PAUSE_PENDING: 'PAUSE_PENDING',
        win32service.SERVICE_PAUSED: 'PAUSED'
    }
    
    SERVICE_TYPES = {
        win32service.SERVICE_KERNEL_DRIVER: 'KERNEL_DRIVER',
        win32service.SERVICE_FILE_SYSTEM_DRIVER: 'FILE_SYSTEM_DRIVER',
        win32service.SERVICE_WIN32_OWN_PROCESS: 'WIN32_OWN_PROCESS',
        win32service.SERVICE_WIN32_SHARE_PROCESS: 'WIN32_SHARE_PROCESS'
    }
    
    START_TYPES = {
        win32service.SERVICE_BOOT_START: 'BOOT_START',
        win32service.SERVICE_SYSTEM_START: 'SYSTEM_START',
        win32service.SERVICE_AUTO_START: 'AUTO_START',
        win32service.SERVICE_DEMAND_START: 'DEMAND_START',
        win32service.SERVICE_DISABLED: 'DISABLED'
    }
    
    def list_services(self, status: Optional[str] = None) -> List[Dict]:
        """List all services, optionally filtered by status"""
        services = []
        try:
            service_list = win32serviceutil.GetServiceDisplayName('')
            for service_info in win32serviceutil.IterServiceStatus():
                service = {
                    'name': service_info[0],
                    'display_name': service_info[1],
                    'status': self.SERVICE_STATES.get(service_info[2], 'UNKNOWN'),
                    'service_type': service_info[3],
                    'win32_exit_code': service_info[4],
                    'service_exit_code': service_info[5],
                    'check_point': service_info[6],
                    'wait_hint': service_info[7]
                }
                if status is None or service['status'].lower() == status.lower():
                    services.append(service)
        except Exception as e:
            return [{'error': str(e)}]
        return services
    
    def get_service_info(self, service_name: str) -> Dict:
        """Get detailed information about a service"""
        try:
            hscm = win32service.OpenSCManager(None, None, win32service.SC_MANAGER_ALL_ACCESS)
            hs = win32service.OpenService(hscm, service_name, win32service.SERVICE_ALL_ACCESS)
            
            status = win32service.QueryServiceStatus(hs)
            config = win32service.QueryServiceConfig(hs)
            
            info = {
                'name': service_name,
                'display_name': config[7],
                'state': self.SERVICE_STATES.get(status[1], 'UNKNOWN'),
                'type': self.SERVICE_TYPES.get(config[0], 'UNKNOWN'),
                'start_type': self.START_TYPES.get(config[1], 'UNKNOWN'),
                'executable': config[3],
                'description': config[10] if len(config) > 10 else '',
                'dependencies': config[5] if config[5] else [],
                'service_account': config[6],
                'startup_delay': config[11] if len(config) > 11 else 0
            }
            
            win32service.CloseServiceHandle(hs)
            win32service.CloseServiceHandle(hscm)
            return info
        except Exception as e:
            return {'error': str(e)}
    
    def start_service(self, service_name: str, wait_time: int = 30) -> Dict:
        """Start a service"""
        try:
            win32serviceutil.StartService(service_name)
            return {'status': 'started', 'service': service_name}
        except Exception as e:
            return {'error': str(e)}
    
    def stop_service(self, service_name: str, wait_time: int = 30) -> Dict:
        """Stop a service"""
        try:
            win32serviceutil.StopService(service_name)
            return {'status': 'stopped', 'service': service_name}
        except Exception as e:
            return {'error': str(e)}
    
    def restart_service(self, service_name: str, wait_time: int = 30) -> Dict:
        """Restart a service"""
        try:
            win32serviceutil.RestartService(service_name)
            return {'status': 'restarted', 'service': service_name}
        except Exception as e:
            return {'error': str(e)}
    
    def pause_service(self, service_name: str) -> Dict:
        """Pause a service"""
        try:
            hscm = win32service.OpenSCManager(None, None, win32service.SC_MANAGER_ALL_ACCESS)
            hs = win32service.OpenService(hscm, service_name, win32service.SERVICE_ALL_ACCESS)
            win32service.ControlService(hs, win32service.SERVICE_CONTROL_PAUSE)
            win32service.CloseServiceHandle(hs)
            win32service.CloseServiceHandle(hscm)
            return {'status': 'paused', 'service': service_name}
        except Exception as e:
            return {'error': str(e)}
    
    def resume_service(self, service_name: str) -> Dict:
        """Resume a paused service"""
        try:
            hscm = win32service.OpenSCManager(None, None, win32service.SC_MANAGER_ALL_ACCESS)
            hs = win32service.OpenService(hscm, service_name, win32service.SERVICE_ALL_ACCESS)
            win32service.ControlService(hs, win32service.SERVICE_CONTROL_CONTINUE)
            win32service.CloseServiceHandle(hs)
            win32service.CloseServiceHandle(hscm)
            return {'status': 'resumed', 'service': service_name}
        except Exception as e:
            return {'error': str(e)}
    
    def set_startup_type(self, service_name: str, startup_type: str) -> Dict:
        """Set service startup type (AUTO_START, DEMAND_START, DISABLED, etc.)"""
        try:
            startup_type_map = {
                'AUTO_START': win32service.SERVICE_AUTO_START,
                'DEMAND_START': win32service.SERVICE_DEMAND_START,
                'DISABLED': win32service.SERVICE_DISABLED,
                'BOOT_START': win32service.SERVICE_BOOT_START,
                'SYSTEM_START': win32service.SERVICE_SYSTEM_START
            }
            
            hscm = win32service.OpenSCManager(None, None, win32service.SC_MANAGER_ALL_ACCESS)
            hs = win32service.OpenService(hscm, service_name, win32service.SERVICE_ALL_ACCESS)
            win32service.ChangeServiceConfig(hs, win32service.SERVICE_NO_CHANGE,
                                            startup_type_map.get(startup_type, win32service.SERVICE_DEMAND_START),
                                            win32service.SERVICE_NO_CHANGE, None, None, None, None, None, None)
            win32service.CloseServiceHandle(hs)
            win32service.CloseServiceHandle(hscm)
            return {'status': 'startup_type_changed', 'service': service_name, 'type': startup_type}
        except Exception as e:
            return {'error': str(e)}
    
    def delete_service(self, service_name: str) -> Dict:
        """Delete a service"""
        try:
            hscm = win32service.OpenSCManager(None, None, win32service.SC_MANAGER_ALL_ACCESS)
            hs = win32service.OpenService(hscm, service_name, win32service.SERVICE_ALL_ACCESS)
            win32service.DeleteService(hs)
            win32service.CloseServiceHandle(hs)
            win32service.CloseServiceHandle(hscm)
            return {'status': 'deleted', 'service': service_name}
        except Exception as e:
            return {'error': str(e)}
    
    def create_service(self, service_name: str, display_name: str, executable_path: str,
                      startup_type: str = 'DEMAND_START', description: str = '') -> Dict:
        """Create a new service"""
        try:
            startup_type_map = {
                'AUTO_START': win32service.SERVICE_AUTO_START,
                'DEMAND_START': win32service.SERVICE_DEMAND_START,
                'DISABLED': win32service.SERVICE_DISABLED
            }
            
            hscm = win32service.OpenSCManager(None, None, win32service.SC_MANAGER_ALL_ACCESS)
            hs = win32service.CreateService(hscm, service_name, display_name,
                                           win32service.SERVICE_ALL_ACCESS,
                                           win32service.SERVICE_WIN32_OWN_PROCESS,
                                           startup_type_map.get(startup_type, win32service.SERVICE_DEMAND_START),
                                           win32service.SERVICE_ERROR_NORMAL,
                                           executable_path)
            
            if description:
                win32service.ChangeServiceConfig2(hs, win32service.SERVICE_CONFIG_DESCRIPTION, description)
            
            win32service.CloseServiceHandle(hs)
            win32service.CloseServiceHandle(hscm)
            return {'status': 'created', 'service': service_name}
        except Exception as e:
            return {'error': str(e)}
    
    def get_service_status(self, service_name: str) -> Dict:
        """Get current status of a service"""
        try:
            status = win32serviceutil.QueryServiceStatus(service_name)
            return {
                'service': service_name,
                'status': self.SERVICE_STATES.get(status[1], 'UNKNOWN'),
                'pid': status[8] if len(status) > 8 else None
            }
        except Exception as e:
            return {'error': str(e)}
    
    def is_service_running(self, service_name: str) -> bool:
        """Check if a service is running"""
        try:
            status = win32serviceutil.QueryServiceStatus(service_name)
            return status[1] == win32service.SERVICE_RUNNING
        except:
            return False

# Export the tool
windows_service_manager = WindowsServiceManager()
