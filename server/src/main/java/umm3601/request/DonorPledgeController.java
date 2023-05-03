package umm3601.request;

import com.mongodb.client.model.Updates;
import static com.mongodb.client.model.Filters.eq;
import com.mongodb.client.MongoDatabase;
import org.bson.UuidRepresentation;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;
import java.util.Map;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import umm3601.Authentication;

public class DonorPledgeController {

  private static final String TIMESLOT_REGEX = "^(Monday|Tuesday|Wednesday|Thursday|Friday)$";

  private final JacksonMongoCollection<RequestedItem> requestedItemCollection;
  private final JacksonMongoCollection<Pledge> pledgeCollection;
  private Authentication auth;

  public DonorPledgeController(MongoDatabase database, Authentication auth) {
    this.auth = auth;
    pledgeCollection = JacksonMongoCollection.builder().build(
      database,
      "donorPledges",
      Pledge.class,
      UuidRepresentation.STANDARD);
    requestedItemCollection = JacksonMongoCollection.builder().build(
      database,
      "requestedItems",
      RequestedItem.class,
      UuidRepresentation.STANDARD);
  }

  public void addNewPledge(Context ctx) {
    auth.authenticate(ctx);

    Pledge newPledge = ctx.bodyValidator(Pledge.class)
    .check(req -> req.timeSlot.matches(TIMESLOT_REGEX), "Pledge must contain valid timeslot")
    .get();

    pledgeCollection.insertOne(newPledge);
    System.out.println(newPledge.amount);
    // Find the request by its ID and update the amount needed
    ObjectId requestId = new ObjectId(newPledge.itemId);
    Bson filter = eq("_id", requestId);
    Bson updateOperation = Updates.inc("amount", -newPledge.amount);
    requestedItemCollection.updateOne(filter, updateOperation);

    ctx.json(Map.of("id", newPledge._id));
    ctx.status(HttpStatus.CREATED);
  }
}

