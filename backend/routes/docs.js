const express = require("express");
const router = express.Router();

// Documentation route handler
const documentationMiddleware = (req, res) => {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sehpaathi API Documentation</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-json.min.js"></script>
    <style>
        :root {
            --primary-color: #6366f1;
            --secondary-color: #4f46e5;
            --background-color: #f8fafc;
            --text-color: #1e293b;
            --border-color: #e2e8f0;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            color: var(--text-color);
            background: var(--background-color);
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
        }

        .header {
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            padding: 48px 0;
            margin-bottom: 48px;
        }

        .header h1 {
            font-size: 2.5rem;
            font-weight: 800;
            margin-bottom: 16px;
        }

        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }

        .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            width: 250px;
            height: 100vh;
            background: white;
            padding: 24px;
            border-right: 1px solid var(--border-color);
            overflow-y: auto;
        }

        .main-content {
            margin-left: 250px;
            padding: 24px;
        }

        .section {
            background: white;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            margin-bottom: 32px;
            padding: 24px;
        }

        .section h2 {
            color: var(--primary-color);
            font-size: 1.8rem;
            margin-bottom: 24px;
            padding-bottom: 12px;
            border-bottom: 2px solid var(--border-color);
        }

        .endpoint {
            margin-bottom: 32px;
            padding: 20px;
            border-radius: 8px;
            background: #f8fafc;
            border: 1px solid var(--border-color);
        }

        .method {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 0.9rem;
            margin-right: 12px;
        }

        .get { background: #dbeafe; color: #1e40af; }
        .post { background: #dcfce7; color: #166534; }
        .put { background: #fef3c7; color: #92400e; }
        .delete { background: #fee2e2; color: #991b1b; }

        .endpoint-url {
            display: inline-block;
            font-family: 'Fira Code', monospace;
            font-size: 1rem;
            background: #f1f5f9;
            padding: 8px 16px;
            border-radius: 6px;
            margin: 12px 0;
        }

        .nav-list {
            list-style: none;
        }

        .nav-list li {
            margin-bottom: 12px;
        }

        .nav-list a {
            color: var(--text-color);
            text-decoration: none;
            font-size: 0.95rem;
            display: block;
            padding: 8px 12px;
            border-radius: 6px;
            transition: all 0.2s;
        }

        .nav-list a:hover {
            background: var(--background-color);
            color: var(--primary-color);
        }

        .parameter {
            margin: 16px 0;
            padding: 12px;
            border-radius: 6px;
            background: white;
            border: 1px solid var(--border-color);
        }

        .parameter-name {
            font-weight: 600;
            color: var(--primary-color);
        }

        .parameter-type {
            color: #64748b;
            font-size: 0.9rem;
            margin-left: 8px;
        }

        pre {
            margin: 16px 0;
            border-radius: 8px;
            overflow-x: auto;
        }

        code {
            font-family: 'Fira Code', monospace;
            font-size: 0.9rem;
        }

        @media (max-width: 768px) {
            .sidebar {
                display: none;
            }
            .main-content {
                margin-left: 0;
            }
        }
    </style>
</head>
<body>
    <nav class="sidebar">
        <h3 style="margin-bottom: 16px;">API Reference</h3>
        <ul class="nav-list">
            <li><a href="#health">Health Check</a></li>
            <li><a href="#chat">Chat API</a></li>
            <li><a href="#files">File Management</a></li>
            <li><a href="#admin">Admin APIs</a></li>
        </ul>
    </nav>

    <div class="main-content">
        <header class="header">
            <div class="container">
                <h1>Sehpaathi API Documentation</h1>
                <p>Complete API reference for Sehpaathi platform</p>
            </div>
        </header>

        <div class="container">
            <section id="health" class="section">
                <h2>Health Check</h2>
                <div class="endpoint">
    <span class="method get">GET</span>
    <span class="endpoint-url">/health</span>
    <p class="description">Check the API's health status and get detailed system information about the server.</p>
    
    <h4>Response</h4>
    <pre><code class="language-json">{
    "status": "healthy",
    "timestamp": "2024-11-17T14:37:26.117Z",
    "uptime": 1058.6901789,
    "system": {
        "platform": "win32",
        "nodeVersion": "v20.18.0",
        "memory": {
            "total": "23.69",
            "free": "5.85",
            "used": "17.84",
            "usagePercentage": "75.32"
        },
        "cpu": {
            "cores": 16,
            "model": "AMD Ryzen 7 7435HS",
            "speed": 3094,
            "loadAverages": {
                "1min": "0.00",
                "5min": "0.00",
                "15min": "0.00"
            }
        },
        "hostname": "Eclipse",
        "osType": "Windows_NT",
        "osRelease": "10.0.22631"
    },
    "services": {
        "files": {
            "status": "operational",
            "latency": "45ms"
        },
        "chat": {
            "status": "operational",
            "latency": "32ms"
        },
        "database": {
            "status": "operational",
            "latency": "28ms"
        }
    },
    "responseTime": "0.55ms"
}</code></pre>

    <h4>Response Fields</h4>
    <div class="parameter">
        <span class="parameter-name">status</span>
        <span class="parameter-type">string</span>
        <p>Current health status of the API ("healthy" or "unhealthy")</p>
    </div>
    
    <div class="parameter">
        <span class="parameter-name">timestamp</span>
        <span class="parameter-type">string</span>
        <p>ISO timestamp of when the health check was performed</p>
    </div>
    
    <div class="parameter">
        <span class="parameter-name">uptime</span>
        <span class="parameter-type">number</span>
        <p>Server uptime in seconds</p>
    </div>
    
    <div class="parameter">
        <span class="parameter-name">system</span>
        <span class="parameter-type">object</span>
        <p>Detailed system information including platform, memory, and CPU details</p>
    </div>
    
    <div class="parameter">
        <span class="parameter-name">services</span>
        <span class="parameter-type">object</span>
        <p>Status and latency information for each service (files, chat, database)</p>
    </div>
    
    <div class="parameter">
        <span class="parameter-name">responseTime</span>
        <span class="parameter-type">string</span>
        <p>Time taken to generate the health check response</p>
    </div>
</div>
            </section>

            <section id="chat" class="section">
                <h2>Chat API</h2>
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="endpoint-url">/api/chat/message</span>
                    <p class="description">Send a message to the AI chatbot and receive a response.</p>
                    
                    <h4>Request Body</h4>
                    <div class="parameter">
                        <span class="parameter-name">message</span>
                        <span class="parameter-type">string</span>
                        <p>The message text to send to the chatbot</p>
                    </div>

                    <h4>Response</h4>
                    <pre><code class="language-json">{
  "status": "success",
  "data": {
    "message": {
      "text": "AI generated response",
      "sender": "ai"
    }
  }
}</code></pre>
                </div>
            </section>

            <section id="files" class="section">
                <h2>File Management</h2>
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="endpoint-url">/api/files/upload</span>
                    <p class="description">Upload a file to the user's storage.</p>
                    
                    <div class="parameter">
                        <span class="parameter-name">file</span>
                        <span class="parameter-type">multipart/form-data</span>
                        <p>The file to upload (max size: 10MB)</p>
                    </div>

                    <h4>Response</h4>
                    <pre><code class="language-json">{
  "success": true,
  "file": {
    "id": "string",
    "name": "string",
    "viewUrl": "string",
    "downloadUrl": "string",
    "createdTime": "string"
  }
}</code></pre>
                </div>

                <div class="endpoint">
                    <span class="method get">GET</span>
                    <span class="endpoint-url">/api/files/list</span>
                    <p class="description">List all files in the user's storage.</p>

                    <h4>Response</h4>
                    <pre><code class="language-json">{
  "success": true,
  "folderUrl": "string",
  "files": [
    {
      "id": "string",
      "name": "string",
      "viewUrl": "string",
      "downloadUrl": "string",
      "createdTime": "string"
    }
  ]
}</code></pre>
                </div>

                <div class="endpoint">
                    <span class="method delete">DELETE</span>
                    <span class="endpoint-url">/api/files/delete/:fileId</span>
                    <p class="description">Delete a specific file.</p>

                    <h4>Response</h4>
                    <pre><code class="language-json">{
  "success": true,
  "message": "File deleted successfully"
}</code></pre>
                </div>
            </section>

            <section id="admin" class="section">
                <h2>Admin APIs</h2>
                <div class="endpoint">
                    <span class="method post">POST</span>
                    <span class="endpoint-url">/api/files/admin/upload</span>
                    <p class="description">Upload a file with academic metadata (admin only).</p>
                    
                    <h4>Request Parameters</h4>
                    <div class="parameter">
                        <span class="parameter-name">file</span>
                        <span class="parameter-type">multipart/form-data</span>
                        <p>The file to upload (max size: 50MB)</p>
                    </div>
                    <div class="parameter">
                        <span class="parameter-name">branch</span>
                        <span class="parameter-type">string</span>
                        <p>Academic branch name</p>
                    </div>
                    <div class="parameter">
                        <span class="parameter-name">semester</span>
                        <span class="parameter-type">string</span>
                        <p>Semester number</p>
                    </div>
                    <div class="parameter">
                        <span class="parameter-name">subject</span>
                        <span class="parameter-type">string</span>
                        <p>Subject name</p>
                    </div>
                    <div class="parameter">
                        <span class="parameter-name">category</span>
                        <span class="parameter-type">string</span>
                        <p>File category (Class Notes, Lecture PPTs, etc.)</p>
                    </div>

                    <h4>Response</h4>
                    <pre><code class="language-json">{
  "success": true,
  "file": {
    "id": "string",
    "name": "string",
    "viewUrl": "string",
    "downloadUrl": "string",
    "createdTime": "string",
    "branch": "string",
    "semester": "string",
    "subject": "string",
    "category": "string"
  }
}</code></pre>
                </div>
            </section>
        </div>
    </div>

    <script>
        // Highlight code blocks
        Prism.highlightAll();

        // Smooth scroll for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    </script>
</body>
</html>
`);
};

// Mount the documentation route
router.get("/", documentationMiddleware);

module.exports = router;
