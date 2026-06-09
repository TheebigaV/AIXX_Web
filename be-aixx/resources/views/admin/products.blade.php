<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Products Admin - AI Hardware Categories</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
    <style>
        body {font-family: 'Inter', sans-serif; background: #f0f2f5; margin:0; padding:0;}
        .container {max-width: 1200px; margin: 2rem auto; background: #fff; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);}
        h1 {font-size: 2rem; margin-bottom: 1.5rem; color: #2c3e50;}
        .grid {display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem;}
        .card {background: linear-gradient(135deg, #e0eafc, #cfdef3); border-radius: 10px; padding: 1.5rem; transition: transform 0.2s, box-shadow 0.2s;}
        .card:hover {transform: translateY(-4px); box-shadow: 0 8px 20px rgba(0,0,0,0.12);}
        .card h2 {font-size: 1.25rem; margin: 0 0 .5rem; color: #34495e;}
        .card p {font-size: .95rem; color: #555; margin:0;}
    </style>
</head>
<body>
<div class="container">
    <h1>AI Hardware Product Categories</h1>
    <div class="grid">
        <div class="card">
            <img src="{{ asset('images/ai_hardware_integration.png') }}" alt="AI Hardware Integration">
            <h2>AI Hardware Integration</h2>
            <p>Integrating advanced AI hardware components to boost performance, scalability, and efficiency.</p>
        </div>
        <div class="card">
            <img src="{{ asset('images/ai_computing_systems.png') }}" alt="AI Computing Systems">
            <h2>AI Computing Systems</h2>
            <p>High‑performance workstations and enterprise platforms optimized for machine learning and analytics.</p>
        </div>
        <div class="card">
            <img src="{{ asset('images/hardware_optimization.png') }}" alt="Hardware Optimization">
            <h2>Hardware Optimization</h2>
            <p>Custom enhancements to memory, storage, and specialized processors for AI workloads.</p>
        </div>
        <div class="card">
            <img src="{{ asset('images/edge_ai_solutions.png') }}" alt="Edge AI Solutions">
            <h2>Edge AI Solutions</h2>
            <p>Smart embedded devices delivering real‑time AI inference at the edge.</p>
        </div>
        <div class="card">
            <img src="{{ asset('images/emerging_technologies.png') }}" alt="Emerging Technologies">
            <h2>Emerging Technologies</h2>
            <p>Research and implementation of next‑gen AI hardware architectures and innovative processing solutions.</p>
        </div>
    </div>
</div>
</body>
</html>
