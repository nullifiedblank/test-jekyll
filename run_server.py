import subprocess
import sys
import socket
import shutil
import os

def is_port_in_use(port):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            return s.connect_ex(('localhost', port)) == 0
    except:
        return False

def run_jekyll_server():
    port = 4000
    try:
        if is_port_in_use(port):
            print(f"Error: Port {port} is already in use. Please stop the existing server or process occupying the port.")
            input("Press Enter to exit...")
            sys.exit(1)

        print("Starting Jekyll server...")

        # Try to resolve 'bundle' executable path
        bundle_path = shutil.which("bundle")

        if bundle_path:
            command = [bundle_path, "exec", "jekyll", "serve"]
            subprocess.run(command, check=True)
        else:
            # Fallback for Windows or if shutil.which fails but shell might find it
            if sys.platform.startswith("win"):
                print("Bundle not found via shutil.which, attempting to run via shell...")
                # On Windows, we need to pass a string if we want the shell to resolve 'bundle' (often a bat file)
                subprocess.run("bundle exec jekyll serve", shell=True, check=True)
            else:
                # POSIX fallback
                subprocess.run(["bundle", "exec", "jekyll", "serve"], check=True)

    except FileNotFoundError:
        print("\nError: 'bundle' command not found.")
        print("Please ensure Ruby and Bundler are installed and available in your system's PATH.")
        print("To install bundler, run: gem install bundler")
        input("\nPress Enter to exit...")
        sys.exit(1)
    except subprocess.CalledProcessError as e:
        print(f"\nError running Jekyll server: {e}")
        input("\nPress Enter to exit...")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nStopping Jekyll server...")
        sys.exit(0)
    except Exception as e:
        print(f"\nAn unexpected error occurred: {e}")
        input("\nPress Enter to exit...")
        sys.exit(1)

if __name__ == "__main__":
    run_jekyll_server()
