document.addEventListener('DOMContentLoaded', function () {
  // Mendapatkan elemen-elemen HTML yang diperlukan
  const inputBook = document.getElementById('form');
  const bookSubmit = document.getElementById('formSubmit');
  const incompleteBookshelfList = document.getElementById('uncompleted_lib');
  const completeBookshelfList = document.getElementById('completed_lib');

  const editForm = document.getElementById('editForm');
  const editSubmit = document.getElementById('editSubmit');
  let editingBookId = null;

  // Membuat array untuk menyimpan daftar buku
  let books = [];

  // Memeriksa apakah ada data buku di localStorage
  const storedBooks = localStorage.getItem('books');
  if (storedBooks) {
      books = JSON.parse(storedBooks);
  }

  // Fungsi untuk menyimpan data buku ke localStorage
  function saveBooksToLocalStorage() {
      localStorage.setItem('books', JSON.stringify(books));
  }

  // Function to show the edit form with book data
  function showEditForm(book) {
    document.getElementById('editJudul').value = book.title;
    document.getElementById('editPenulis').value = book.author;
    document.getElementById('editTahun').value = book.year;
    document.getElementById('edit-checkbox').checked = book.isComplete;
    editForm.style.display = 'block';
    editingBookId = book.id;
}

   // Handle edit form submission
   editForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const editedTitle = document.getElementById('editJudul').value;
    const editedAuthor = document.getElementById('editPenulis').value;
    const editedYear = Number(document.getElementById('editTahun').value);
    const editedIsComplete = document.getElementById('edit-checkbox').checked;

    const bookIndex = books.findIndex(book => book.id === editingBookId);
    if (bookIndex !== -1) {
        books[bookIndex] = {
            id: editingBookId,
            title: editedTitle,
            author: editedAuthor,
            year: editedYear,
            isComplete: editedIsComplete
        };
        saveBooksToLocalStorage();
        updateBookshelf();
        editForm.style.display = 'none';
        editingBookId = null;
    }
});


  // Menghandle submit form untuk menambahkan buku
  inputBook.addEventListener('submit', function (e) {
      e.preventDefault();

      // Mendapatkan nilai dari input form
      const inputBookTitle = document.getElementById('inputJudul').value;
      const inputBookAuthor = document.getElementById('inputPenulis').value;
      const inputBookYear = Number(document.getElementById('inputTahun').value);
      const inputBookIsComplete = document.getElementById('default-checkbox').checked;

      // Memeriksa apakah buku dengan judul yang sama sudah ada
      const isDuplicate = books.some(book => book.title === inputBookTitle);

      if (isDuplicate) {
          alert('Tidak Dapat Menambahkan Buku dengan Judul Sama');
      } else {
          // Membuat objek buku baru
          const book = {
              id: new Date().getTime(),
              title: inputBookTitle,
              author: inputBookAuthor,
              year: inputBookYear,
              isComplete: inputBookIsComplete,
          };

          // Menambahkan buku ke daftar dan menyimpan ke localStorage
          books.push(book);
          saveBooksToLocalStorage();
          // Memperbarui tampilan rak buku
          updateBookshelf();

          // Mengosongkan input form setelah menambahkan buku
          document.getElementById('inputJudul').value = '';
          document.getElementById('inputPenulis').value = '';
          document.getElementById('inputTahun').value = '';
          document.getElementById('default-checkbox').checked = false;
      }
  });

  // Fungsi untuk memperbarui tampilan rak buku
  function updateBookshelf() {
      incompleteBookshelfList.innerHTML = '';
      completeBookshelfList.innerHTML = '';

      for (const book of books) {
          const bookItem = createBookItem(book);
          if (book.isComplete) {
              completeBookshelfList.appendChild(bookItem);
          } else {
              incompleteBookshelfList.appendChild(bookItem);
          }
      }
  }

  // Fungsi untuk menghapus buku berdasarkan ID
  function removeBook(id) {
      const index = books.findIndex(book => book.id === id);
      if (index !== -1) {
          books.splice(index, 1);
          saveBooksToLocalStorage();
          updateBookshelf();
      }
  }

  // Fungsi untuk mengganti status selesai atau belum selesai membaca buku
  function toggleIsComplete(id) {
      const index = books.findIndex(book => book.id === id);
      if (index !== -1) {
          books[index].isComplete = !books[index].isComplete;
          saveBooksToLocalStorage();
          updateBookshelf();
      }
  }



  // Fungsi untuk membuat elemen buku dalam daftar
  function createBookItem(book) {
      const bookItem = document.createElement('div');
      bookItem.className = 'card';

      const actionButtons = document.createElement('div');
      actionButtons.className = 'action';

      const title = document.createElement('p');
      title.className = 'margin_element'; 
      title.textContent = 'Judul: '+ book.title;
      
      const author = document.createElement('p');
      author.className = 'margin_element';
      author.textContent = 'Penulis: ' + book.author;
      
      const year = document.createElement('p');
      year.className = 'margin_element';
      year.textContent = 'Tahun: ' + book.year;

      const removeButton = createActionButton('Hapus buku', 'red', function () {
          removeBook(book.id);
      });

      const editButton = createActionButton('Edit buku', 'blue', function () {
        showEditForm(book);
    });

      let toggleButton;
      if (book.isComplete) {
          toggleButton = createActionButton('Belum selesai di Baca', 'yellow', function () {
              toggleIsComplete(book.id);
          });
      } else {
          toggleButton = createActionButton('Selesai dibaca', 'green', function () {
              toggleIsComplete(book.id);
          });
      }

      // Gaya tombol aksi
      removeButton.className = 'remove_button';
      toggleButton.className = 'toggle_button';
      editButton.className = 'edit_button';

      editButton.style.padding = '10px';
      editButton.style.backgroundColor = '#c242f5';
      editButton.style.color = 'white';
      editButton.style.borderRadius = '10px';

      actionButtons.appendChild(toggleButton);
      actionButtons.appendChild(editButton);
      actionButtons.appendChild(removeButton);

      bookItem.appendChild(title);
      bookItem.appendChild(author);
      bookItem.appendChild(year);
      bookItem.appendChild(actionButtons);


      return bookItem;
  }


  // Fungsi untuk membuat elemen tombol aksi
  function createActionButton(text, className, clickHandler) {
      const button = document.createElement('button');
      button.textContent = text;
      button.classList.add(className);
      button.addEventListener('click', clickHandler);
      return button;
  }

  // Memperbarui tampilan rak buku saat halaman dimuat
  updateBookshelf();
});
