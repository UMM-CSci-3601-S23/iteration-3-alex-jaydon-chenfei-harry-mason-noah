package umm3601.pledge;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
import static com.mongodb.client.model.Filters.regex;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;
import org.bson.Document;
import org.bson.UuidRepresentation;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.DBUpdate;
import org.mongojack.JacksonMongoCollection;
import java.util.Map;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;

import java.util.regex.Pattern;



public class PledgeController {
  static final String DESCRIPTION_KEY = "description";
  static final String SORT_ORDER_KEY = "sortorder";

  private final JacksonMongoCollection<PledgedItem> itemCollection;
  private final JacksonMongoCollection<Pledge> pledgeCollection;

  public PledgeController(MongoDatabase database) {
    itemCollection = JacksonMongoCollection.builder().build(
      database,
      "pledgedItems",
      PledgedItem.class,
      UuidRepresentation.STANDARD);

      pledgeCollection = JacksonMongoCollection.builder().build(
      database,
      "pledges",
      Pledge.class,
      UuidRepresentation.STANDARD);
  }

  /**
   * Set the JSON body of the response to be the single request
   * specified by the `id` parameter in the request
   *
   * @param ctx a Javalin HTTP context
   */
  public void getPledgedItem(Context ctx) {
    String id = ctx.pathParam("id");
    PledgedItem item;
    try {
      item = itemCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The desired request id wasn't a legal Mongo Object ID.");
    }
    if (item == null) {
      throw new NotFoundResponse("The desired request was not found");
    } else {
      ctx.json(item);;
      ctx.status(HttpStatus.OK);
    }
  }

  /**
   * Set the JSON body of the response to be a list of all the requests returned from the database
   * that match any requested filters and ordering
   *
   * @param ctx a Javalin HTTP context
   */
  public void getPledgedItems(Context ctx) {
    Bson combinedFilter = constructFilter(ctx);
    Bson sortingOrder = constructSortingOrder(ctx);

    // All three of the find, sort, and into steps happen "in parallel" inside the
    // database system. So MongoDB is going to find the requests with the specified
    // properties, return those sorted in the specified manner, and put the
    // results into an initially empty ArrayList.
    ArrayList<PledgedItem> matchingPledgedItems = itemCollection
      .find(combinedFilter)
      .sort(sortingOrder)
      .into(new ArrayList<>());

    // Set the JSON body of the response to be the list of requests returned by the database.
    // According to the Javalin documentation (https://javalin.io/documentation#context),
    // this calls result(jsonString), and also sets content type to json
    System.out.println(matchingPledgedItems);
    ctx.json(matchingPledgedItems);

    // Explicitly set the context status to OK
    ctx.status(HttpStatus.OK);
  }

  private Bson constructFilter(Context ctx) {
    List<Bson> filters = new ArrayList<>(); // start with a blank document
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
    String sortBy = Objects.requireNonNullElse(ctx.queryParam("sortby"), "itemName");
    String sortOrder = Objects.requireNonNullElse(ctx.queryParam("sortorder"), "asc");
    Bson sortingOrder = sortOrder.equals("desc") ?  Sorts.descending(sortBy) : Sorts.ascending(sortBy);
    return sortingOrder;
  }

  public void updatePledgedItem(Context ctx){
    String id = ctx.pathParam("id");
    String action = ctx.pathParam("action");
    PledgedItem item;
    if (action.equals("post")){
      try {
        item = itemCollection.find(eq("_id", new ObjectId(id))).first();
      } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The desired request id wasn't a legal Mongo Object ID.");
      }
    } else {

    }
  }
  public void addNewPledgedItem(Context ctx) {
    /*
     * The follow chain of statements uses the Javalin validator system
     * to verify that instance of `User` provided in this context is
     * a "legal" request. It checks the following things (in order):
     *    - itemType is valid
     *    - foodType is Valid
     */
    PledgedItem newPledgedItem = ctx.bodyValidator(PledgedItem.class).get();

    // Add the date to the request formatted as an ISO 8601 string
    newPledgedItem.amountNeeded = 1;

    // Insert the newPledgedItem into the itemCollection
    itemCollection.insertOne(newPledgedItem);

    ctx.json(Map.of("id", newPledgedItem._id));
    // 201 is the HTTP code for when we successfully
    // create a new resource (a request in this case).
    // See, e.g., https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    // for a description of the various response codes.
    ctx.status(HttpStatus.CREATED);
  }

}
