package com.lemon.menu;

import com.lemon.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MenuService {

    private final MenuRepository menuRepository;

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service-role-key}")
    private String serviceRoleKey;

    @Value("${supabase.storage-bucket}")
    private String bucket;

    public List<Menu> getMenus(String base, String q) {
        String baseParam = (base == null || base.isBlank()) ? null : base;
        String qParam    = (q == null || q.isBlank()) ? null : q;
        return menuRepository.search(baseParam, qParam);
    }

    @Transactional
    public Menu createMenu(MenuRequest req, MultipartFile photo) throws IOException, InterruptedException {
        String photoUrl = photo != null && !photo.isEmpty() ? uploadPhoto(photo) : null;
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
    public Menu updateMenu(UUID id, MenuRequest req, MultipartFile photo) throws IOException, InterruptedException {
        Menu menu = menuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("메뉴를 찾을 수 없습니다."));
        if (req.getName() != null)        menu.setName(req.getName());
        if (req.getBase() != null)        menu.setBase(req.getBase());
        if (req.getAbv() != null)         menu.setAbv(req.getAbv());
        if (req.getPrice() != null)       menu.setPrice(req.getPrice());
        if (req.getDescription() != null) menu.setDescription(req.getDescription());
        if (photo != null && !photo.isEmpty()) {
            menu.setPhotoUrl(uploadPhoto(photo));
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

    private String uploadPhoto(MultipartFile file) throws IOException, InterruptedException {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucket + "/" + fileName;

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(uploadUrl))
                .header("Authorization", "Bearer " + serviceRoleKey)
                .header("Content-Type", file.getContentType())
                .POST(HttpRequest.BodyPublishers.ofByteArray(file.getBytes()))
                .build();

        HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
        return supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + fileName;
    }
}
