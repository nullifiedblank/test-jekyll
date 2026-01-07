import subprocess
import sys
import socket
import shutil

def is_port_in_use(port):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

def run_jekyll_server():
    port = 4000
    try:
        if is_port_in_use(port):
            print(f"Error: Port {port} is already in use. Please stop the existing server or process occupying the port.")
            input("Press Enter to exit...")
            sys.exit(1)

        print("Starting Jekyll server...")
        subprocess.run(["bundle", "exec", "jekyll", "serve"], check=True)

    except FileNotFoundError:
        print("Error: 'bundle' command not found. Please ensure Ruby and Bundler are installed and in your PATH.")
        print("To install bundler, run: gem install bundler")
        input("Press Enter to exit...")
        sys.exit(1)
    except subprocess.CalledProcessError as e:
        print(f"Error running Jekyll server: {e}")
        input("Press Enter to exit...")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nStopping Jekyll server...")
        sys.exit(0)
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        input("Press Enter to exit...")
        sys.exit(1)

if __name__ == "__main__":
    run_jekyll_server()
