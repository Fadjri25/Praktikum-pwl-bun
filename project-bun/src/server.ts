const server = Bun.serve({
  port: 3001,
  
  fetch(request) {
    const startTime = performance.now();

    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    console.log(`[${new Date().toLocaleTimeString()}] 📥 Request Masuk: ${method} ${path}`);

    let response: Response;

    // --- Routing manual ---
    if (path === '/' && method === 'GET') {
      response = new Response('<h1>🏠 Halaman Utama (Bun)</h1><p>Selamat datang di server Bun + TypeScript!</p>', {
        headers: { 'Content-Type': 'text/html' },
      });
    }
    else if (path === '/about' && method === 'GET') {
      response = new Response('<h1>📄 Tentang Kami (Bun)</h1><p>Routing manual dengan Bun sangat mudah!</p>', {
        headers: { 'Content-Type': 'text/html' },
      });
    }
    else if (path === '/api/users' && method === 'GET') {
      response = new Response(JSON.stringify([
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' }
      ]), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    else if (path === '/api/users' && method === 'POST') {
      response = new Response(JSON.stringify({ message: 'User berhasil dibuat (Bun)' }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    else if (path === '/products' && method === 'GET') {
      response = new Response(JSON.stringify([
        { id: 1, name: "Laptop" }, 
        { id: 2, name: "Mouse" }
      ]), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    else if (path === '/products' && method === 'POST') {
      response = new Response(JSON.stringify({ message: 'Pesan Sukses: Produk berhasil ditambahkan!' }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    // [Latihan 2] Rute Parameter Dinamis: GET /users/:id
    else if (path.startsWith('/users/') && method === 'GET') {
      const parts = path.split('/');
      const userIdStr = parts[2]; // Ini bisa undefined menurut TypeScript

      // PERBAIKAN: Cek dulu apakah userIdStr benar-benar ada
      if (userIdStr) {
        // Karena sudah di dalam blok if(userIdStr), TypeScript menganggapnya aman (pasti string)
        const userId = parseInt(userIdStr, 10);

        if (!isNaN(userId)) {
          const mockUsers = [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
            { id: 123, name: 'Syahru Rahmayuda' }
          ];

          const user = mockUsers.find(u => u.id === userId);

          if (user) {
            response = new Response(JSON.stringify(user), {
              headers: { 'Content-Type': 'application/json' },
            });
          } else {
            response = new Response(JSON.stringify({ message: `User dengan ID ${userId} tidak ditemukan.` }), {
              status: 404,
              headers: { 'Content-Type': 'application/json' },
            });
          }
        } else {
          response = new Response(JSON.stringify({ message: 'Format ID harus berupa angka!' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      } else {
        // Menangani jika URL yang diketik hanya /users/ (tanpa angka)
        response = new Response(JSON.stringify({ message: 'ID User tidak disertakan di URL!' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
    // [Fallback 404] Jika tidak ada rute yang cocok
    else {
      response = new Response('<h1>❌ 404 - Halaman Tidak Ditemukan (Bun)</h1>', {
        status: 404,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    const duration = performance.now() - startTime;
    console.log(`[${new Date().toLocaleTimeString()}] 📤 Selesai: ${method} ${path} - Status: ${response.status} (${duration.toFixed(2)}ms)\n`);

    return response;
  },
});

console.log(`🚀 Server Bun berjalan di http://localhost:${server.port}`);