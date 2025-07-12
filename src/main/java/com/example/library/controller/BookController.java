package com.example.library.controller;

import com.example.library.model.Book;
import com.example.library.service.BookService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/books")
public class BookController {

    private final BookService service;

    public BookController(BookService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Book> addBook(@Valid @RequestBody Book book) {
        Book created = service.addBook(book);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        return ResponseEntity.ok(service.getAllBooks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBook(@PathVariable int id) {
        Book book = service.getBookById(id);
        if (book == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(book);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteBook(@PathVariable int id) {
        boolean removed = service.deleteBook(id);
        Map<String, Object> response = new HashMap<>();
        response.put("bookId", id);
        if (removed) {
            response.put("message", "Book deleted successfully.");
            return ResponseEntity.ok(response);
        }
        response.put("error", "Book not found");
        return ResponseEntity.status(404).body(response);
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<Map<String, Object>> updateAvailability(@PathVariable int id,
                                                                  @RequestParam boolean available) {
        boolean updated = service.updateAvailability(id, available);
        if (updated) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Book availability updated successfully.");
            response.put("bookId", id);
            response.put("available", available);
            return ResponseEntity.ok(response);
        }
        Map<String, Object> error = new HashMap<>();
        error.put("error", "Book not found");
        error.put("bookId", id);
        return ResponseEntity.status(404).body(error);
    }
}
