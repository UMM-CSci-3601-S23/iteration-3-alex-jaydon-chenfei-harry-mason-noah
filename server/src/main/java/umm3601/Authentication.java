package umm3601;

import io.javalin.http.ContentType;
import io.javalin.http.Context;
import io.javalin.http.ForbiddenResponse;
import io.javalin.http.HttpStatus;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Authentication {
  private boolean bypassAuth = false;
  private Logger logger;

  public Authentication() {
    logger = LoggerFactory.getLogger(Server.class);
  }

  public Authentication(boolean bypass) {
    bypassAuth = bypass;
    logger = LoggerFactory.getLogger(Server.class);

    if (bypassAuth) {
      logger.warn("Disabling Default Auth Using `--no-auth` flag, accepting dummy token only");
    } else {
      logger.info("Using Default Auth Scheme");
    }
  }

  /**
   * Check the authentication of a connection to make requests which requires a volunteer role
   * @param ctx
   */
  public void authenticate(Context ctx) throws ForbiddenResponse {
    String cookie = ctx.cookie("auth_token");

    if (bypassAuth) {
      if (!(ctx.cookie("auth_token") != null && cookie.equals("TOKEN"))) {

        ctx.status(HttpStatus.FORBIDDEN);
          throw new ForbiddenResponse("Client not authenticated");
      }
    } else {
      // Todo: This is where the actual authentication should go
      if (!(ctx.cookie("auth_token") != null && cookie.equals("TOKEN"))) {

        ctx.status(HttpStatus.FORBIDDEN);
          throw new ForbiddenResponse("Client not authenticated");
      }
    }
  }

  // Magically grant authorization for the demo
  // DO NOT USE THIS! THIS IS A TERRIBLE IDEA AND NOT THE WAY SECURITY SHOULD EVER WORK, THIS IS FOR THE DEMO ONLY
  public void grant(Context ctx) {
    ctx.cookie("auth_token", "TOKEN");
    ctx.status(HttpStatus.OK);
    ctx.contentType(ContentType.HTML);
    ctx.result("<h1></b>"
      + "DO NOT USE THIS! THIS IS A TERRIBLE IDEA AND NOT THE WAY SECURITY SHOULD EVER WORK, THIS IS FOR THE DEMO ONLY!"
      + "<b></h1>");
  }
}
