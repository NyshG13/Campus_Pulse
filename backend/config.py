#env vars are loaded, project constants are called, 
#API keys, secret keys are managed 
#to configure global application settings 
#Controls how your app is configured – project name, prefix /api/v1, DB URL, etc. Changing this changes how your app behaves globally.

import os 
from dotenv import load_dotenv 
load_dotenv() 

class Settings: 
    PROJECT_NAME: str = "Campus Pulse Backend" 
    API_V1_STR: str = "/api/v1" 
    DATABASE_URL: str = os.getenv(
         "DATABASE_URL", 
         "postgresql+psycopg2://postgres:postgres@localhost:8080/campus_pulse", 
        ) 
    
settings = Settings()