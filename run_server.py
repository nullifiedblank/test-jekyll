#!/usr/bin/env python3
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

def run_bundler_cmd(args, check=True):
    """
    Runs a bundler command (e.g., ['check'], ['install'], ['exec', 'jekyll', 'serve']).
    Handles resolving the 'bundle' executable on Windows/POSIX.
    """
    bundle_path = shutil.which("bundle")

    if bundle_path:
        command = [bundle_path] + args
        return subprocess.run(command, check=check)
    else:
        # Fallback if shutil.which doesn't find it (e.g., some Windows setups)
        if sys.platform.startswith("win"):
            # Use shell=True to let the shell resolve 'bundle'
            cmd_str = "bundle " + " ".join(args)
            return subprocess.run(cmd_str, shell=True, check=check)
        else:
            # POSIX fallback
            command = ["bundle"] + args
            return subprocess.run(command, check=check)

def run_jekyll_server():
    port = 4000
    try:
        if is_port_in_use(port):
            print(f"Error: Port {port} is already in use. Please stop the existing server or process occupying the port.")
            input("Press Enter to exit...")
            sys.exit(1)

        # 1. Check dependencies
        print("Checking dependencies...")
        try:
            # check=False because we want to handle the exit code manually
            check_proc = run_bundler_cmd(["check"], check=False)
            if check_proc.returncode != 0:
                print("\nDependencies missing. Running 'bundle install'...")
                run_bundler_cmd(["install"], check=True)
                print("Dependencies installed successfully.\n")
        except FileNotFoundError:
             # This catches if 'bundle' itself is missing in the shell=True or list cases if not found
             print("\nError: 'bundle' command not found.")
             print("Please ensure Ruby and Bundler are installed and available in your system's PATH.")
             print("To install bundler, run: gem install bundler")
             input("\nPress Enter to exit...")
             sys.exit(1)

        # 2. Start Server
        print("Starting Jekyll server...")
        run_bundler_cmd(["exec", "jekyll", "serve"], check=True)

    except subprocess.CalledProcessError as e:
        # This catches errors from run_bundler_cmd when check=True (install or serve)
        print(f"\nError running command: {e}")
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
