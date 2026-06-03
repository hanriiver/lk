package com.lemon.menu;

import com.lemon.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MenuService {

    private final MenuRepository menuRepository;

    @Value("${app.upload-dir:/app/uploads}")
    private String uploadDir;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    public List<Menu> getMenus(String base, String q) {
        String baseParam = (base == null || base.isBlank()) ? null : base;
        String qParam    = (q == null || q.isBlank()) ? null : q;
        return menuRepository.search(baseParam, qParam);
    }

    @Transactional
    public Menu createMenu(MenuRequest req, MultipartFile photo) throws IOException {
        String photoUrl = photo != null && !photo.isEmpty() ? uploadPhoto(photo, "menus") : null;
        Menu menu = Menu.builder()
                .name(req.getName())
                .base(req.getBase())
                .abv(req.getAbv())
                .price(req.getPrice())
                .description(req.getDescription())
                .photoUrl(photoUrl)
                .build();
        return menuRepository.save(menu);
    }

    @Transactional
    public Menu updateMenu(UUID id, MenuRequest req, MultipartFile photo) throws IOException {
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("메뉴를 찾을 수 없습니다."));
        if (req.getName() != null)        menu.setName(req.getName());
        if (req.getBase() != null)        menu.setBase(req.getBase());
        if (req.getAbv() != null)         menu.setAbv(req.getAbv());
        if (req.getPrice() != null)       menu.setPrice(req.getPrice());
        if (req.getDescription() != null) menu.setDescription(req.getDescription());
        if (photo != null && !photo.isEmpty()) {
            menu.setPhotoUrl(uploadPhoto(photo, "menus"));
        }
        return menu;
    }

    @Transactional
    public void deleteMenu(UUID id) {
        if (!menuRepository.existsById(id)) {
            throw new ResourceNotFoundException("메뉴를 찾을 수 없습니다.");
        }
        menuRepository.deleteById(id);
    }

    private String uploadPhoto(MultipartFile file, String folder) throws IOException {
        String ext = Optional.ofNullable(file.getOriginalFilename())
                .filter(n -> n.contains("."))
                .map(n -> n.substring(n.lastIndexOf('.')))
                .orElse("");
        String fileName = UUID.randomUUID() + ext;
        Path dir = Paths.get(uploadDir, folder);
        Files.createDirectories(dir);
        Files.write(dir.resolve(fileName), file.getBytes());
        return baseUrl + "/uploads/" + folder + "/" + fileName;
    }
}
