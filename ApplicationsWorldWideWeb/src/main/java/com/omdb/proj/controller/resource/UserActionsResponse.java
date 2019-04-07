package com.omdb.proj.controller.resource;

import java.util.UUID;

public class UserActionsResponse {

    private UUID userkey;
    private boolean hasError;
    private String errorMessage;

    public UserActionsResponse(UUID userkey, boolean hasError, String errorMessage) {
        this.userkey = userkey;
        this.hasError = hasError;
        this.errorMessage = errorMessage;
    }

    public static UserActionsResponse ok(UUID userkey) {
        return new UserActionsResponse(userkey, false, null);
    }

    public static UserActionsResponse error(String errorMessage) {
        return new UserActionsResponse(null, true, errorMessage);
    }

    public UUID getUserkey() {
        return userkey;
    }

    public void setUserkey(UUID userkey) {
        this.userkey = userkey;
    }

    public boolean isHasError() {
        return hasError;
    }

    public void setHasError(boolean hasError) {
        this.hasError = hasError;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}
