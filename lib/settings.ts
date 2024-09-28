






export  class Settings {
    postgresUser: string;
    postgresPassword: string;
    postgresDatabase: string;
    postgresHost: string;
    postgresPort: number;
    caCertificate: string;
    redisHost: string;
    redisPort: number;
    redisPassword: string;
    redisUsername: string;
    resendApiKey: string;

   constructor(){

       this.postgresUser = this.getValue("POSTGRES_USER", "postgres");
       this.postgresPassword = this.getValue("POSTGRES_PASSWORD", "postgres");
       this.postgresDatabase = this.getValue("POSTGRES_DATABASE", "postgres");
       this.postgresHost = this.getValue("POSTGRES_HOST", "localhost");
       this.postgresPort = Number(this.getValue("POSTGRES_PORT", "5432"));
       this.caCertificate = this.getValue("CA_CERTIFICATE", "");

       this.redisHost = this.getValue("REDIS_HOST", "localhost");
       this.redisPort = Number(this.getValue("REDIS_PORT", "6379"));
       this.redisPassword = this.getValue("REDIS_PASSWORD", "");
       this.redisUsername = this.getValue("REDIS_USERNAME", "");

       this.resendApiKey = this.getValue("RESEND_API_KEY", "");
   }




    private getValue(key: string , defaultValue: string) {
        const value = process.env[key];
        if(value) {
            return value
        }else {
            return defaultValue
        }
    }



}

export const settings = new Settings();


