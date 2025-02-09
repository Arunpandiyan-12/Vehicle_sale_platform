package com.example.CarDetails.dto;

import java.util.List;

public class ResponseDto {
    private List<CarDetailDto> carDetailDtoList;
    private UserDto userDto;

    public ResponseDto(List<CarDetailDto> carDetailDtoList, UserDto userDto) {
        this.carDetailDtoList = carDetailDtoList;
        this.userDto = userDto;
    }

    public ResponseDto() {
    }

    public List<CarDetailDto> getCarDetailDtoList() {
        return carDetailDtoList;
    }

    public void setCarDetailDtoList(List<CarDetailDto> carDetailDtoList) {
        this.carDetailDtoList = carDetailDtoList;
    }

    public UserDto getUserDto() {
        return userDto;
    }

    public void setUserDto(UserDto userDto) {
        this.userDto = userDto;
    }
// Getters and Setters
}
