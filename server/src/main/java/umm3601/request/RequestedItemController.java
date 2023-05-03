package umm3601.request;
import com.mongodb.client.model.Updates;
import umm3601.request.Request;
import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.regex.Pattern;

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

public class RequestedItemController {
  static final String NAME_KEY = "name";

  private final JacksonMongoCollection<RequestedItem> itemCollection;
  private Authentication auth;

  public RequestedItemController(MongoDatabase database, Authentication auth) {
    this.auth = auth;
    itemCollection = JacksonMongoCollection.builder().build(
      database,
      "requestedItems",
      RequestedItem.class,
      UuidRepresentation.STANDARD);

  }

  public void getItem(Context ctx) {
    String id = ctx.pathParam("id");
    RequestedItem item;

    try {
      item = itemCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The desired request id wasn't a legal Mongo Object ID.");
    }
    if (item == null) {
      throw new NotFoundResponse("The desired request was not found");
    } else {
      ctx.json(item);
      ctx.status(HttpStatus.OK);
    }
  }

  public void getItems(Context ctx) {
    Bson combinedFilter = constructFilter(ctx);

    // All three of the find, sort, and into steps happen "in parallel" inside the
    // database system. So MongoDB is going to find the requests with the specified
    // properties, return those sorted in the specified manner, and put the
    // results into an initially empty ArrayList.
    ArrayList<RequestedItem> matchingItems = itemCollection
      .find(combinedFilter)
      .into(new ArrayList<>());
    // Set the JSON body of the response to be the list of requests returned by the database.
    // According to the Javalin documentation (https://javalin.io/documentation#context),
    // this calls result(jsonString), and also sets content type to json
    System.out.println(matchingItems);
    ctx.json(matchingItems);

    // Explicitly set the context status to OK
    ctx.status(HttpStatus.OK);
  }

  private Bson constructFilter(Context ctx) {
    List<Bson> filters = new ArrayList<>(); // start with a blank document
    if (ctx.queryParamMap().containsKey(NAME_KEY)) {
      Pattern pattern = Pattern.compile(Pattern.quote(ctx.queryParam(NAME_KEY)),
      Pattern.CASE_INSENSITIVE);
      filters.add(regex(NAME_KEY, pattern));
    }


    // Combine the list of filters into a single filtering document.
    Bson combinedFilter = filters.isEmpty() ? new Document() : and(filters);

    return combinedFilter;
  }


  public void addNewItem(Context ctx) {
    auth.authenticate(ctx);

    RequestedItem newItem = ctx.bodyValidator(RequestedItem.class).get();
    Bson filter = eq("name", newItem.name);

    if (itemCollection.findOne(filter) != null){
      RequestedItem existingItem = itemCollection.findOne(filter);
      Bson updateOperation = Updates.inc("amount", +newItem.amount);
      itemCollection.updateOne(filter, updateOperation);
      ctx.status(HttpStatus.OK);
    } else {
      itemCollection.insertOne(newItem);
      ctx.json(Map.of("id", newItem._id));
      ctx.status(HttpStatus.CREATED);
    }



    //if (itemCollection.findOne(filter)
    // Find the request by its ID and update the amount needed
    System.out.println("jefoeo jefeffef");

  }
}
