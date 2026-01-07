import subprocess
import sys

def run_jekyll_server():
    try:
        print("Starting Jekyll server...")
        subprocess.run(["bundle", "exec", "jekyll", "serve"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error running Jekyll server: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nStopping Jekyll server...")
        sys.exit(0)

if __name__ == "__main__":
    run_jekyll_server()
