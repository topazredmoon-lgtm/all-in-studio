#!/usr/bin/env python3
"""All-in Studio Command Center Live HTTP & REST API Server
Provides:
- Live web interface at http://localhost:4321
- Video streaming with HTTP 206 Partial Content (smooth scrubbing)
- REST APIs for studio tool dispatching, notes persistence, and research runs
"""

import os, sys, json, mimetypes, subprocess, re
from pathlib import Path
from http.server import HTTPServer, BaseHTTPRequestHandler
from socketserver import ThreadingMixIn

ROOT = Path(__file__).resolve().parent.parent
KEEP = ROOT.parent
VIDEOS_DIR = ROOT / "videos"
DELIVERABLES_DIR = KEEP / "deliverables"
DASHBOARD_DIR = ROOT / "dashboard"
DATA_DIR = DASHBOARD_DIR / "data"

class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True

class StudioHandler(BaseHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Range")
        self.send_header("Access-Control-Expose-Headers", "Content-Range, Accept-Ranges, Content-Length")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        path = self.path.split("?")[0]
        
        # Root dashboard HTML: serves All-in/index.html
        if path in ("/", "/index.html"):
            index_path = ROOT / "index.html"
            if not index_path.exists():
                index_path = ROOT.parent / "index.html"
            if not index_path.exists():
                index_path = DASHBOARD_DIR / "index.html"
            if not index_path.exists():
                self.send_error(404, "Dashboard HTML not found")
                return
            content = index_path.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(content)))
            self.end_headers()
            self.wfile.write(content)
            return

        # API Status
        if path == "/api/status":
            self.send_json({"status": "active", "port": 4321, "version": "2026-10-15"})
            return

        # API Data: /api/data serves studio_data.json
        if path == "/api/data":
            p = ROOT / "studio_data.json"
            if not p.exists():
                p = DATA_DIR / "studio_data.json"
            self.serve_file_or_404(p, "application/json")
            return

        # API Data endpoints
        if path == "/api/manifest":
            p = DATA_DIR / "manifest.json"
            self.serve_file_or_404(p, "application/json")
            return

        if path == "/api/dossiers":
            p = DATA_DIR / "topic_dossiers.json"
            self.serve_file_or_404(p, "application/json")
            return

        if path == "/api/incubator":
            p = DATA_DIR / "viral_incubator.json"
            self.serve_file_or_404(p, "application/json")
            return

        if path == "/api/telemetry":
            p = DATA_DIR / "telemetry.json"
            self.serve_file_or_404(p, "application/json")
            return

        # Media streaming endpoint: /media/<rel_path>
        if path.startswith("/media/"):
            rel = path[7:]
            target_file = None

            if rel.startswith("../deliverables/"):
                target_file = DELIVERABLES_DIR / rel[16:]
            elif rel.startswith("videos/"):
                target_file = ROOT / rel
            elif rel.startswith("deliverables/"):
                target_file = KEEP / rel
            else:
                target_file = ROOT / rel

            if not target_file or not target_file.exists() or not target_file.is_file():
                self.send_error(404, f"File not found: {rel}")
                return

            self.serve_media_with_range(target_file)
            return

        self.send_error(404, "Endpoint not found")

    def do_POST(self):
        path = self.path.split("?")[0]
        
        # Action runner: /api/action/run
        if path == "/api/action/run":
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length).decode("utf-8")
            try:
                data = json.loads(body)
                action = data.get("action", "")
                topic = data.get("topic", "")
                
                cmd = ["powershell", "-NoProfile", "-ExecutionPolicy", "Bypass", "-File", str(KEEP / "allin.ps1"), action]
                if topic: cmd.append(topic)
                
                res = subprocess.run(cmd, cwd=str(KEEP), capture_output=True, text=True, timeout=120)
                output = res.stdout + "\n" + res.stderr
                self.send_json({"code": res.returncode, "output": output})
            except Exception as e:
                self.send_json({"code": 1, "error": str(e)}, status=500)
            return

        # Research trigger: /api/research/run
        if path == "/api/research/run":
            try:
                from autonomous_studio import compile_studio_data, build_standalone_html
                m, d, i, t = compile_studio_data()
                build_standalone_html(m, d, i, t)
                self.send_json({"status": "ok", "message": "Autonomous studio scan and deep research cycle complete."})
            except Exception as e:
                self.send_json({"status": "error", "error": str(e)}, status=500)
            return

        # Notes save: /api/notes/save
        if path == "/api/notes/save":
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length).decode("utf-8")
            try:
                data = json.loads(body)
                topic = data.get("topic")
                note = data.get("note")
                if topic:
                    notes_file = DATA_DIR / "notes.json"
                    notes_data = {}
                    if notes_file.exists():
                        try: notes_data = json.loads(notes_file.read_text(encoding="utf-8"))
                        except: pass
                    notes_data[topic] = note
                    notes_file.write_text(json.dumps(notes_data, indent=2), encoding="utf-8")
                self.send_json({"status": "saved"})
            except Exception as e:
                self.send_json({"error": str(e)}, status=500)
            return

        self.send_error(404, "POST endpoint not found")

    def serve_json(self, data, status=200):
        content = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def serve_file_or_404(self, path, mime_type):
        if not path.exists():
            self.send_error(404, "File not found")
            return
        content = path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", mime_type)
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def serve_media_with_range(self, path):
        """Stream media files with HTTP 206 Range support."""
        file_size = path.stat().st_size
        mime_type, _ = mimetypes.guess_type(str(path))
        if not mime_type:
            mime_type = "video/mp4" if path.suffix == ".mp4" else "application/octet-stream"

        range_header = self.headers.get("Range")
        if range_header:
            match = re.match(r"bytes=(\d+)-(\d*)", range_header)
            if match:
                start = int(match.group(1))
                end = int(match.group(2)) if match.group(2) else file_size - 1
                end = min(end, file_size - 1)
                chunk_len = end - start + 1

                self.send_response(206)
                self.send_header("Content-Type", mime_type)
                self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
                self.send_header("Content-Length", str(chunk_len))
                self.send_header("Accept-Ranges", "bytes")
                self.end_headers()

                with open(path, "rb") as f:
                    f.seek(start)
                    self.wfile.write(f.read(chunk_len))
                return

        # Entire file
        self.send_response(200)
        self.send_header("Content-Type", mime_type)
        self.send_header("Content-Length", str(file_size))
        self.send_header("Accept-Ranges", "bytes")
        self.end_headers()
        with open(path, "rb") as f:
            while chunk := f.read(65536):
                try:
                    self.wfile.write(chunk)
                except (BrokenPipeError, ConnectionResetError):
                    break

def run_server(port=4321):
    server_address = ("127.0.0.1", port)
    httpd = ThreadedHTTPServer(server_address, StudioHandler)
    print(f"\n=======================================================")
    print(f" ALL-IN Studio Command Center Server is LIVE:")
    print(f" URL: http://localhost:{port}")
    print(f"=======================================================\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        httpd.server_close()

if __name__ == "__main__":
    p = 4321
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        p = int(sys.argv[1])
    run_server(p)
