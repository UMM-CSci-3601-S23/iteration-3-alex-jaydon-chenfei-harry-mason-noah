package umm3601.request;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Updates.set;
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

import java.security.NoSuchAlgorithmException;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;


public class ClientRequestController {
  static final String ITEM_TYPE_KEY = "itemType";
  static final String FOOD_TYPE_KEY = "foodType";
  static final String SORT_ORDER_KEY = "sortorder";
  static final String DESCRIPTION_KEY = "description";
  static final String PRIORITY_KEY = "priority";

  static final int LOWER_PRIORITY_BOUND = 1; // highest possible request priority (#1 most important)
  static final int UPPER_PRIORITY_BOUND = 5; // lowest possible (#5)

  private static final String ITEM_TYPE_REGEX = "^(food|toiletries|other|FOOD)$";
  private static final String FOOD_TYPE_REGEX = "^(|dairy|grain|meat|fruit|vegetable)$";

  private final JacksonMongoCollection<Request> requestCollection;
  private Authentication auth;

  public ClientRequestController(MongoDatabase database, Authentication auth) {
    this.auth = auth;
    requestCollection = JacksonMongoCollection.builder().build(
      database,
      "requests",
      Request.class,
      UuidRepresentation.STANDARD);
  }

  /**
   * Set the JSON body of the response to be the single request
   * specified by the `id` parameter in the request
   *
   * @param ctx a Javalin HTTP context
   */
  public void getRequest(Context ctx) {
    String id = ctx.pathParam("id");
    Request request;

    try {
      request = requestCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The desired request id wasn't a legal Mongo Object ID.");
    } catch (NullPointerException e) {
      throw new NotFoundResponse("The desired request was not found");
    }
    if (request == null) {
      throw new NotFoundResponse("The desired request was not found");
    }
    ctx.json(request);
    ctx.status(HttpStatus.OK);
  }

  /**
   * Set the JSON body of the response to be a list of all the requests returned from the database
   * that match any requested filters and ordering
   *
   * @param ctx a Javalin HTTP context
   */
  public void getRequests(Context ctx) {
    auth.authenticate(ctx);

    Bson combinedFilter = constructFilter(ctx);
    Bson sortingOrder = constructSortingOrder(ctx);

    // All three of the find, sort, and into steps happen "in parallel" inside the
    // database system. So MongoDB is going to find the requests with the specified
    // properties, return those sorted in the specified manner, and put the
    // results into an initially empty ArrayList.
    ArrayList<Request> matchingRequests = requestCollection
      .find(combinedFilter)
      .sort(sortingOrder)
      .into(new ArrayList<>());

    // Set the JSON body of the response to be the list of requests returned by the database.
    // According to the Javalin documentation (https://javalin.io/documentation#context),
    // this calls result(jsonString), and also sets content type to json
    ctx.json(matchingRequests);

    // Explicitly set the context status to OK
    ctx.status(HttpStatus.OK);
  }

  private Bson constructFilter(Context ctx) {
    List<Bson> filters = new ArrayList<>(); // start with a blank document
    if (ctx.queryParamMap().containsKey(ITEM_TYPE_KEY)) {
      String itemType = ctx.queryParamAsClass(ITEM_TYPE_KEY, String.class)
        .check(it -> it.matches(ITEM_TYPE_REGEX), "Request must contain valid item type")
        .get();
      filters.add(eq(ITEM_TYPE_KEY, itemType));
    }
    if (ctx.queryParamMap().containsKey(FOOD_TYPE_KEY)) {
      String foodType = ctx.queryParamAsClass(FOOD_TYPE_KEY, String.class)
        .check(it -> it.matches(FOOD_TYPE_REGEX), "Request must contain valid food type")
        .get();
      filters.add(eq(FOOD_TYPE_KEY, foodType));
    }
    if (ctx.queryParamMap().containsKey(DESCRIPTION_KEY)) {
      Pattern pattern = Pattern.compile(Pattern.quote(ctx.queryParam(DESCRIPTION_KEY)),
      Pattern.CASE_INSENSITIVE);
      filters.add(regex(DESCRIPTION_KEY, pattern));
    }


    // Combine the list of filters into a single filtering document.
    Bson combinedFilter = filters.isEmpty() ? new Document() : and(filters);

    return combinedFilter;
  }

  private Bson constructSortingOrder(Context ctx) {
    // Sort the results. Use the `sortby` query param (default "name")
    // as the field to sort by, and the query param `sortorder` (default
    // "asc") to specify the sort order.
    String sortBy = Objects.requireNonNullElse(ctx.queryParam("sortby"), "priority");
    String sortOrder = Objects.requireNonNullElse(ctx.queryParam("sortorder"), "asc");
    Bson sortingOrder = sortOrder.equals("desc") ?  Sorts.descending(sortBy) : Sorts.ascending(sortBy);
    return sortingOrder;
  }

  public void addNewRequest(Context ctx) {
    /*
     * The follow chain of statements uses the Javalin validator system
     * to verify that instance of `User` provided in this context is
     * a "legal" request. It checks the following things (in order):
     *    - itemType is valid
     *    - foodType is Valid
     */
    Request newRequest = ctx.bodyValidator(Request.class)
      .check(req -> req.itemType.matches(ITEM_TYPE_REGEX), "Request must contain valid item type")
      .check(req -> req.foodType.matches(FOOD_TYPE_REGEX), "Request must contain valid food type").get();

    // Add the date to the request formatted as an ISO 8601 string
    newRequest.dateAdded = ZonedDateTime.now(ZoneOffset.UTC).format(DateTimeFormatter.ISO_INSTANT);

    // Insert the newRequest into the requestCollection
    requestCollection.insertOne(newRequest);

    ctx.json(Map.of("id", newRequest._id));
    // 201 is the HTTP code for when we successfully
    // create a new resource (a request in this case).
    // See, e.g., https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    // for a description of the various response codes.
    ctx.status(HttpStatus.CREATED);
  }

  public void setPriority(Context ctx) {
    Integer priority = ctx.queryParamAsClass(PRIORITY_KEY, Integer.class)
      .check(it -> it >= LOWER_PRIORITY_BOUND && it <= UPPER_PRIORITY_BOUND,
    "Priority must be a number between 1 and 5 inclusive")
      .get();
    String id = ctx.pathParam("id");
    Request request;
    try {
      // ctx requires an _id path parameter.
      // We should make sure this is a real request id before continuing.
      request = requestCollection
        .find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The desired request id wasn't a legal Mongo Object ID");
    } catch (NotFoundResponse e) {
      throw new NotFoundResponse("The desired request was not found");
    }

    List<Bson> toSet = new ArrayList<>();
    toSet.add(eq("_id", new ObjectId(id))); // filter

    toSet.add(set("priority", priority)); // update

    requestCollection.updateOne(
        toSet.get(0) /* filter */,
        toSet.get(1) /* update */
    );
    request.priority = priority;
    // Send a JSON response with the request whose priority was changed.
    ctx.json(request);
    ctx.status(HttpStatus.OK);
  }

  /**
   * Delete the user specified by the `id` parameter in the request.
   *
   * @param ctx a Javalin HTTP context
   */
  public void deleteRequest(Context ctx) {
    auth.authenticate(ctx);
    String id = ctx.pathParam("id");
    DeleteResult deleteResult = requestCollection.deleteOne(eq("_id", new ObjectId(id)));
    if (deleteResult.getDeletedCount() != 1) {
      ctx.status(HttpStatus.NOT_FOUND);
      throw new NotFoundResponse(
        "Was unable to delete ID "
          + id
          + "; perhaps illegal ID or an ID for an item not in the system?");
    }
    ctx.status(HttpStatus.OK);
  }


  /**
   * Utility function to generate the md5 hash for a given string
   *
   * @param str the string to generate a md5 for
   */
  @SuppressWarnings("lgtm[java/weak-cryptographic-algorithm]")
  public String md5(String str) throws NoSuchAlgorithmException {
    MessageDigest md = MessageDigest.getInstance("MD5");
    byte[] hashInBytes = md.digest(str.toLowerCase().getBytes(StandardCharsets.UTF_8));

    StringBuilder result = new StringBuilder();
    for (byte b : hashInBytes) {
      result.append(String.format("%02x", b));
    }
    return result.toString();
  }
}
