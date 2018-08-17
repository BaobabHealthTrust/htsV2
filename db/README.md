# HIV Testing Services (HTS)

## Setup New Database Instance
1. Install application dependencies as outlined in the main setup
2. Make sure all application configurations have been made according to the main setup
3. Inside the db/ folder, install database dependencies by running the command
    ```
        npm install --save --verbose
    ```
4. Run the command to setup the new database instance by running
    ```
        ./seed.js
    ```
   WARNING: This command will completely wipe out your data so use it sparingly

## Modify an Existing Database Instance
1. Install application dependencies as outlined in the main setup
2. Make sure all application configurations have been made according to the main setup
3. Inside the db/ folder, install database dependencies by running the command
    ```
        npm install --save --verbose
    ```
4. Run the command to setup the new database instance by running
    ```
        ./recalibrate.js
    ```
5. PLEASE run the command on #4 twice for proper effectiveness