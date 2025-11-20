$(document).ready(function() {
    const apiUrl = 'https://f48geda4u7.execute-api.us-east-1.amazonaws.com/1/guests'; // Ganti dengan URL API Gateway Anda
    let selectedGuestId = null; // Menyimpan ID tamu yang dipilih untuk diupdate

    // Fungsi untuk menampilkan notifikasi
    function showNotification(message, type) {
        const notification = $('#notification');
        notification.removeClass('d-none alert-success alert-danger');
        notification.addClass(`alert-${type}`);
        notification.text(message);

        // Notifikasi akan hilang dalam 3 detik
        setTimeout(() => {
            notification.addClass('d-none');
        }, 3000);
    }

    // Fetch guests (READ - GET)
    function loadGuests() {
        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function(response) {
                console.log('Respons API:', response); // Debug: Lihat respons API di konsol
    
                // Parse `body` dari string JSON ke array objek
                let data;
                try {
                    data = typeof response === 'string' ? JSON.parse(response) : response;
                } catch(e) {
                    console.error('Failed to parse JSON:', e);
                    data = [];
                }

                $('#guestList').empty();
    
                if (data.length === 0) {
                    showNotification('Daftar tamu kosong.', 'warning');
                } else {
                    showNotification('Daftar tamu berhasil dimuat.', 'success');
                }
    
                data.forEach((guest, index) => {
                    console.log('Tamu:', guest); // Debug: Lihat setiap tamu di konsol
                    $('#guestList').append(`
                        <tr>
                            <td>${index + 1}</td>
                            <td>${guest.nama}</td>
                            <td>${guest.pesan}</td>
                            <td>
                                <button class="btn btn-info btn-sm" onclick="editGuest('${guest.id}', '${guest.nama}', '${guest.pesan}')">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteGuest('${guest.id}')">Hapus</button>
                            </td>
                        </tr>
                    `);
                });
            },
            error: function(xhr, status, error) {
                console.error('Error:', error); // Debug: Lihat error di konsol
                showNotification('Gagal memuat daftar tamu!', 'danger');
            }
        });
    }

    // Tambah/Edit tamu (CREATE/UPDATE - POST/PUT)
    $('#guestForm').submit(function(event) {
        event.preventDefault();
        const name = $('#name').val();
        const message = $('#message').val();
        const method = selectedGuestId ? 'PUT' : 'POST';
        const url = selectedGuestId ? `${apiUrl}/${selectedGuestId}` : apiUrl;

        $.ajax({
            url: url,
            method: method,
            data: JSON.stringify({ nama: name, pesan: message }), // Sesuaikan dengan properti yang diharapkan API
            contentType: 'application/json',
            success: function() {
                $('#name').val('');
                $('#message').val('');
                selectedGuestId = null; // Reset selected guest
                loadGuests();

                if (method === 'POST') {
                    showNotification('Tamu berhasil ditambahkan!', 'success');
                } else {
                    showNotification('Tamu berhasil diperbarui!', 'success');
                }
            },
            error: function() {
                if (method === 'POST') {
                    showNotification('Gagal menambahkan tamu!', 'danger');
                } else {
                    showNotification('Gagal memperbarui tamu!', 'danger');
                }
            }
        });
    });

    // Edit guest (Memasukkan data ke form, bukan API call)
    window.editGuest = function(id, name, message) {
        selectedGuestId = id;
        $('#name').val(name);
        $('#message').val(message);
        showNotification('Edit mode: Silakan perbarui data tamu.', 'info');
    };

    // Hapus tamu (DELETE)
    window.deleteGuest = function(id) {
        $.ajax({
            url: `${apiUrl}/${id}`,
            method: 'DELETE',
            success: function() {
                loadGuests();
                showNotification('Tamu berhasil dihapus!', 'success');
            },
            error: function() {
                showNotification('Gagal menghapus tamu!', 'danger');
            }
        });
    };

    // Load daftar tamu saat halaman dimuat
    loadGuests();
});





