package umm3601.request;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import com.mongodb.client.result.DeleteResult;
import org.bson.Document;
import org.bson.UuidRepresentation;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;
import java.util.Map;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import umm3601.Authentication;

public class DonorPledgeController {

  private static final String TIMESLOT_REGEX = "^(Monday|Tuesday|Wednesday|Thursday|Friday)$";

  private final JacksonMongoCollection<Pledge> pledgeCollection;
  private Authentication auth;

  public DonorPledgeController(MongoDatabase database, Authentication auth) {
    this.auth = auth;
    pledgeCollection = JacksonMongoCollection.builder().build(
      database,
      "donorPledges",
      Pledge.class,
      UuidRepresentation.STANDARD);
  }

  public void addNewPledge(Context ctx) {
    auth.authenticate(ctx);

    Pledge newPledge = ctx.bodyValidator(Pledge.class)
    .check(req -> req.timeSlot.matches(TIMESLOT_REGEX), "Pledge must contain valid timeslot")
    .get();

    pledgeCollection.insertOne(newPledge);
    ctx.json(Map.of("id", newPledge._id));
    ctx.status(HttpStatus.CREATED);
  }
}

