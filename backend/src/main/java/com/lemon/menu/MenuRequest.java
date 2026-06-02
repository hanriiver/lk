package com.lemon.menu;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class MenuRequest {
    @NotBlank(message = "메뉴 이름을 입력하세요")
    private String name;

    @NotBlank(message = "카테고리를 선택하세요")
    private String base;

    private Double abv;
    private Integer price;
    private String description;
}
