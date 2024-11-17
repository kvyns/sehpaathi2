import subprocess
import os
import time
import re
from threading import Thread, Event


def monitor_server_output(process, name, port, success_flag, stop_event, color):
    """
    Monitors the output of a server process to detect when it's ready.
    """
    url_pattern = re.compile(rf"http://localhost:{port}")
    try:
        for line in iter(process.stdout.readline, ''):
            if stop_event.is_set():
                break
            if line:
                cleaned_line = line.strip()
                match = url_pattern.search(cleaned_line)
                if match:
                    print(f"\033[{color}m{name} started at {match.group(0)}\033[0m")
                    success_flag.append(True)
                    return match.group(0)
                elif name == "Frontend Server" and "VITE" in cleaned_line.upper() and "READY" in cleaned_line.upper():
                    # Handle Vite's readiness message
                    print(f"\033[{color}m{name} started at http://localhost:{port}\033[0m")
                    success_flag.append(True)
                    return f"http://localhost:{port}"
    except Exception as e:
        if not stop_event.is_set():  # Only print error if not shutting down
            print(f"\033[31mError in {name} output monitoring: {e}\033[0m")


def start_server(name, command, cwd, port, color):
    """
    Starts a server process and monitors its output for success.
    """
    success_flag = []
    stop_event = Event()
    try:
        process = subprocess.Popen(
            command,
            cwd=cwd,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        thread = Thread(
            target=monitor_server_output,
            args=(process, name, port, success_flag, stop_event, color),
            daemon=True
        )
        thread.start()
        return process, success_flag, stop_event, thread
    except Exception as e:
        print(f"\033[31mError starting {name}: {e}\033[0m")
        return None, [], None, None


if __name__ == "__main__":
    # Paths to frontend and backend directories
    frontend_dir = os.path.join(os.getcwd(), "frontend")
    backend_dir = os.path.join(os.getcwd(), "backend")

    # Commands to run
    backend_command = "npm start"  # Adjust if your backend start command differs
    frontend_command = "npm run dev"  # Adjust if your frontend start command differs

    # Ports for servers
    backend_port = 3000
    frontend_port = 5173

    # Assign colors (Backend: Cyan, Frontend: Green)
    backend_color = "36"  # Cyan
    frontend_color = "32"  # Green

    # Clear terminal and display header
    print("\033c", end="")
    print("Starting servers...\n")

    # Start Backend Server
    backend_process, backend_ready, backend_stop_event, backend_thread = start_server(
        "Backend Server", backend_command, backend_dir, backend_port, backend_color
    )

    # Start Frontend Server
    frontend_process, frontend_ready, frontend_stop_event, frontend_thread = start_server(
        "Frontend Server", frontend_command, frontend_dir, frontend_port, frontend_color
    )

    try:
        # Wait for both servers to start
        while not all([backend_ready, frontend_ready]):
            time.sleep(1)

        # Display success message
        print("\n\033[33mApplication running at:\033[0m")
        print(f"\033[{backend_color}mBackend: http://localhost:{backend_port}\033[0m")
        print(f"\033[{frontend_color}mFrontend: http://localhost:{frontend_port}\033[0m")

        # Keep the main thread alive
        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        # Graceful Shutdown
        print("\n\033[33mShutting down servers...\033[0m")  # Yellow for shutdown

        # Stop threads
        backend_stop_event.set()
        frontend_stop_event.set()

        # Terminate processes
        if backend_process:
            backend_process.terminate()
            backend_process.wait()
            print("\033[36mBackend Server stopped gracefully.\033[0m")  # Cyan

        if frontend_process:
            frontend_process.terminate()
            frontend_process.wait()
            print("\033[32mFrontend Server stopped gracefully.\033[0m")  # Green

        # Wait for threads to finish
        if backend_thread:
            backend_thread.join()
        if frontend_thread:
            frontend_thread.join()

        print("\033[32mServers stopped gracefully.\033[0m")  # Final Green Message
