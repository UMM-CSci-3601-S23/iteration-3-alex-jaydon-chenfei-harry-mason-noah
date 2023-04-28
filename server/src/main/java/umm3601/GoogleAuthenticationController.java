package umm3601;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import io.javalin.http.Context;
import io.javalin.http.Handler;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.SecureRandom;
import java.util.Base64;
import umm3601.Server;

/*
 Working with CORS: https://javalin.io/plugins/cors
*/

public class GoogleAuthenticationController implements Handler {

    private static final int SERVER_PORT = Server.SERVER_PORT;
    private static final String BASE_URI = "https://accounts.google.com/o/oauth2/v2/auth";
    private static final String TOKEN_URI = "https://oauth2.googleapis.com/token";
    private static final String CLIENT_ID = "662107657916-qr702be6n57p43kig8e2ub74esc1da5j.apps.googleusercontent.com";
    private static final String CLIENT_SECRET = "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";
    private static final String REDIRECT_URI = "http://localhost:36355" ;

    @Override
    public void handle(Context ctx) throws Exception {

        ctx.header("Access-Control-Allow-Origin", "*");
        ctx.header("Access-Control-Allow-Headers", "Access-Control-Allow-Origin");

        System.out.println("Handling Google Authentication Request");

        // Generate random state string
        String state = generateStateString();
        ctx.sessionAttribute("state", state);

        // Build the URI for the authentication request
        String uri = BASE_URI +
                "?client_id=" + CLIENT_ID +
                "&response_type=code" +
                "&scope=https://www.googleapis.com/auth/drive" +
                "&redirect_uri=" + REDIRECT_URI +
                "&state=" + state;

        // Redirect the user to the authentication page
        System.out.println("Redirecting user to the Google authentication page: " + uri);
        ctx.redirect(uri);
    }

    public void handleGoogleAuthCallback(Context ctx) throws IOException, InterruptedException {
        System.out.println("Handling Google Authentication Callback");

        ctx.header("Access-Control-Allow-Origin", "*");

        // Check if state parameter is present
        String state = ctx.queryParam("state");
        if (state == null) {
            ctx.status(400).result("Missing state parameter");
            return;
        }

        // Ensure that there is no request forgery going on, and that the user
        // sending us this connect request is the user that was supposed to.
        String sessionState = ctx.sessionAttribute("state");
        if (!state.equals(sessionState)) {
            ctx.status(401).result("Invalid state parameter");
            return;
        }

        // Exchange authorization code for access token
        String code = ctx.queryParam("code");
        if (code == null) {
            ctx.status(400).result("Missing authorization code");
            return;
        }
        String accessToken = exchangeAuthorizationCodeForAccessToken(code);

        // Use the access token to make a request to the Google Drive API
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://www.googleapis.com/drive/v3/files"))
                .header("Authorization", "Bearer " + accessToken)
                .build();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        String responseBody = response.body();
        System.out.println("Google Drive API response: " + responseBody);

        // Render a page displaying the response body
        ctx.html("<html><body><h1>Google Drive API Response:</h1><pre>" + responseBody + "</pre></body></html>");
    }

    private String generateStateString() {
        // Generate a random 20-byte array
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[20];
        random.nextBytes(bytes);

        // Encode the byte array as a base64 string
        String base64 = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        return base64;
    }

    private String exchangeAuthorizationCodeForAccessToken(String authorizationCode) throws IOException, InterruptedException {
      // Build the request body for the token exchange
      String requestBody = "code=" + authorizationCode +
              "&client_id=" + CLIENT_ID +
              "&client_secret=" + CLIENT_SECRET +
              "&redirect_uri=" + REDIRECT_URI +
              "&grant_type=authorization_code";

      // Make the token exchange request
      HttpClient client = HttpClient.newHttpClient();
      HttpRequest request = HttpRequest.newBuilder()
              .uri(URI.create(TOKEN_URI))
              .header("Content-Type", "application/x-www-form-urlencoded")
              .POST(HttpRequest.BodyPublishers.ofString(requestBody))
              .build();
      HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
      String responseBody = response.body();
      System.out.println("Token exchange response: " + responseBody);

      // Parse the access token from the response body
      JsonObject json = new Gson().fromJson(responseBody, JsonObject.class);
      String accessToken = json.get("access_token").getAsString();
      System.out.println("Access token: " + accessToken);

      return accessToken;
  }
}
