package umm3601.request;

import com.mongodb.client.model.Updates;
import com.mongodb.client.result.DeleteResult;

import static com.mongodb.client.model.Filters.eq;
import com.mongodb.client.MongoDatabase;
import org.bson.UuidRepresentation;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import java.util.ArrayList;
import java.util.Map;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import umm3601.Authentication;

public class PledgeController {

  private static final String TIMESLOT_REGEX = "^(Monday|Tuesday|Wednesday|Thursday|Friday)$";

  private final JacksonMongoCollection<RequestedItem> requestedItemCollection;
  private final JacksonMongoCollection<Pledge> pledgeCollection;
  private Authentication auth;

  public PledgeController(MongoDatabase database, Authentication auth) {
    this.auth = auth;
    pledgeCollection = JacksonMongoCollection.builder().build(
      database,
      "pledges",
      Pledge.class,
      UuidRepresentation.STANDARD);
    requestedItemCollection = JacksonMongoCollection.builder().build(
      database,
      "requestedItems",
      RequestedItem.class,
      UuidRepresentation.STANDARD);
  }

  public void getPledges(Context ctx) {
    auth.authenticate(ctx);

    // All three of the find, sort, and into steps happen "in parallel" inside the
    // database system. So MongoDB is going to find the requests with the specified
    // properties, return those sorted in the specified manner, and put the
    // results into an initially empty ArrayList.
    ArrayList<Pledge> matchingRequests = pledgeCollection.find().into(new ArrayList<>());

    // Set the JSON body of the response to be the list of requests returned by the database.
    // According to the Javalin documentation (https://javalin.io/documentation#context),
    // this calls result(jsonString), and also sets content type to json
    ctx.json(matchingRequests);

    // Explicitly set the context status to OK
    ctx.status(HttpStatus.OK);
  }

  public void addNewPledge(Context ctx) {
    auth.authenticate(ctx);

    Pledge newPledge = ctx.bodyValidator(Pledge.class)
    .check(req -> req.timeSlot.matches(TIMESLOT_REGEX), "Pledge must contain valid timeslot")
    .get();

    pledgeCollection.insertOne(newPledge);
    System.out.println(newPledge.amount);
    // Find the request by its ID and update the amount needed
    ObjectId itemName2 = new ObjectId(newPledge.itemName);
    Bson filter = eq("name", itemName2);
    Bson updateOperation = Updates.inc("amount", -newPledge.amount);
    requestedItemCollection.updateOne(filter, updateOperation);

    ctx.json(Map.of("id", newPledge._id));
    ctx.status(HttpStatus.CREATED);
  }

  public void deletePledge(Context ctx) {
    auth.authenticate(ctx);
    String id = ctx.pathParam("id");
    DeleteResult deleteResult = pledgeCollection.deleteOne(eq("_id", new ObjectId(id)));
    if (deleteResult.getDeletedCount() != 1) {
      ctx.status(HttpStatus.NOT_FOUND);
      throw new NotFoundResponse(
        "Was unable to delete ID "
          + id
          + "; perhaps illegal ID or an ID for an item not in the system?");
    }
    ctx.status(HttpStatus.OK);
  }
}

