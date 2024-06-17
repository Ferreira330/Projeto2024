import subprocess
import json

# Function to export MongoDB data to JSON file
def export_mongodb_to_json(database, collection, json_file, docker_container):
    # Check if JSON file name is provided
    if not json_file:
        print(f"Skipping import: No JSON file provided for collection '{collection}'.")
        return
    
    # Step 1: Export MongoDB data to JSON using mongoexport
    export_command = f"docker exec {docker_container} mongoexport -d {database} -c {collection} --out /tmp/{json_file} --jsonArray"
    subprocess.run(export_command, shell=True)

    # Step 2: Copy exported JSON file from Docker container to host machine
    copy_command = f"docker cp {docker_container}:/tmp/{json_file} ./{json_file}"
    subprocess.run(copy_command, shell=True)

    print(f"Exported MongoDB data to {json_file}")

    # Step 3: Read exported JSON file and format it nicely
    with open(json_file, 'r') as f:
        data = json.load(f)

    with open(json_file, 'w') as f:
        json.dump(data, f, indent=4)

    print(f"Formatted {json_file} for readability")


if __name__ == "__main__":
    # Configuration
    database = "ruasBraga"                          # Database name in MongoDB
    docker_container = "mongoEW"                    # Docker container name or ID for MongoDB

    # User input for JSON file names
    json_fileRuas = input("Enter JSON file name for 'ruasBraga' collection (or leave empty to skip): ")
    json_fileUsers = input("Enter JSON file name for 'users' collection (or leave empty to skip): ")

    # Export MongoDB data to JSON file
    export_mongodb_to_json(database, "ruasBraga", json_fileRuas, docker_container)
    export_mongodb_to_json(database, "users", json_fileUsers, docker_container)
