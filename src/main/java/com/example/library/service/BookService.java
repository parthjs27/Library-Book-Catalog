package com.example.library.service;

import com.example.library.model.Book;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BookService {
    private final Map<Integer, Book> bookStorage = new HashMap<>();
    private int nextId = 1;

    public Book addBook(Book book) {
        book.setId(nextId++);
        bookStorage.put(book.getId(), book);
        return book;
    }

    public List<Book> getAllBooks() {
        return new ArrayList<>(bookStorage.values());
    }

    public Book getBookById(int id) {
        return bookStorage.get(id);
    }

    public boolean deleteBook(int id) {
        return bookStorage.remove(id) != null;
    }

    public boolean updateAvailability(int id, boolean available) {
        Book book = bookStorage.get(id);
        if (book != null) {
            book.setAvailable(available);
            return true;
        }
        return false;
    }
}
