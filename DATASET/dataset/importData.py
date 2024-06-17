import os
import subprocess

# Function to import JSON file into MongoDB
def import_json_to_mongodb(json_file, database, collection, docker_container):
    # Check if JSON file name is provided
    if not json_file:
        print(f"Skipping import: No JSON file provided for collection '{collection}'.")
        return
    # Check if JSON file exists
    if not os.path.exists(json_file):
        print(f"File not found: {json_file}")
        return
    
    # Step 1: Copy JSON file to tmp folder inside MongoDB Docker container
    copy_command = f"docker cp {json_file} {docker_container}:/tmp"
    subprocess.run(copy_command, shell=True)

    # Step 2: Import JSON file into MongoDB using mongoimport
    import_command = f"docker exec {docker_container} mongoimport -d {database} -c {collection} --file /tmp/{json_file} --jsonArray --drop"
    subprocess.run(import_command, shell=True)

    print(f"Imported {json_file} into MongoDB database '{database}', collection '{collection}'")

if __name__ == "__main__":
    # Configuration
    database = "ruasBraga"                          # Database name in MongoDB
    docker_container = "mongoEW"                    # Docker container name or ID for MongoDB
    
    # User input for JSON file names
    json_fileRuas = input("Enter JSON file name for 'ruasBraga' collection (or leave empty to skip): ")
    json_fileUsers = input("Enter JSON file name for 'users' collection (or leave empty to skip): ")

    # Import JSON file into MongoDB
    import_json_to_mongodb(json_fileRuas, database, "ruasBraga", docker_container)
    import_json_to_mongodb(json_fileUsers, database, "users", docker_container)
