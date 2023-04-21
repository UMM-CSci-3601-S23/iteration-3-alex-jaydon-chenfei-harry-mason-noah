package umm3601.request;



import static com.mongodb.client.model.Filters.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.io.IOException;
import java.security.NoSuchAlgorithmException;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import io.javalin.validation.BodyValidator;
import io.javalin.validation.ValidationException;
import io.javalin.validation.Validator;
import umm3601.Authentication;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.ForbiddenResponse;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import io.javalin.json.JavalinJackson;

/**
 * Tests the logic of the RequestController
 *
 * @throws IOException
 */
// The tests here include a ton of "magic numbers" (numeric constants).
// It wasn't clear to me that giving all of them names would actually
// help things. The fact that it wasn't obvious what to call some
// of them says a lot. Maybe what this ultimately means is that
// these tests can/should be restructured so the constants (there are
// also a lot of "magic strings" that Checkstyle doesn't actually
// flag as a problem) make more sense.
@SuppressWarnings({ "MagicNumber" })
class DonorRequestControllerSpec {

  // An instance of the controller we're testing that is prepared in
  // `setupEach()`, and then exercised in the various tests below.
  private DonorRequestController requestController;

  // A Mongo object ID that is initialized in `setupEach()` and used
  // in a few of the tests. It isn't used all that often, though,
  // which suggests that maybe we should extract the tests that
  // care about it into their own spec file?
  private ObjectId samsId;

  // The client and database that will be used
  // for all the tests in this spec file.
  private static MongoClient mongoClient;
  private static MongoDatabase db;

  // Used to translate between JSON and POJOs.
  private static JavalinJackson javalinJackson = new JavalinJackson();

  @Mock
  private Context ctx;

  @Captor
  private ArgumentCaptor<ArrayList<Request>> requestArrayListCaptor;

  @Captor
  private ArgumentCaptor<Request> requestCaptor;

  @Captor
  private ArgumentCaptor<Map<String, String>> mapCaptor;

  /**
   * Sets up (the connection to the) DB once; that connection and DB will
   * then be (re)used for all the tests, and closed in the `teardown()`
   * method. It's somewhat expensive to establish a connection to the
   * database, and there are usually limits to how many connections
   * a database will support at once. Limiting ourselves to a single
   * connection that will be shared across all the tests in this spec
   * file helps both speed things up and reduce the load on the DB
   * engine.
   */
  @BeforeAll
  static void setupAll() {
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");

    mongoClient = MongoClients.create(
        MongoClientSettings.builder()
            .applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
            .build()
    );
    db = mongoClient.getDatabase("test");
  }

  @AfterAll
  static void teardown() {
    db.drop();
    mongoClient.close();
  }

  @BeforeEach
  void setupEach() throws IOException {
    // Reset our mock context and argument captor (declared with Mockito annotations @Mock and @Captor)
    MockitoAnnotations.openMocks(this);

    // Setup database
    MongoCollection<Document> requestDocuments = db.getCollection("donorRequests");
    requestDocuments.drop();
    List<Document> testRequests = new ArrayList<>();
    testRequests.add(
        new Document()
            // .append("itemType", "food")
            .append("description", "apple")
            // .append("foodType", "fruit"));
    testRequests.add(
        new Document()
            // .append("itemType", "other")
            .append("description", "Paper Plate")
            // .append("foodType", ""));
    testRequests.add(
        new Document()
            // .append("itemType", "toiletries")
            .append("description", "tooth paste")
            // append("foodType", ""));

    samsId = new ObjectId();
    Document sam = new Document()
        .append("_id", samsId)
        // .append("itemType", "food")
        .append("description", "steak")
        // .append("foodType", "meat");

    requestDocuments.insertMany(testRequests);
    requestDocuments.insertOne(sam);

    requestController = new DonorRequestController(db, new Authentication(true));
  }

  @Test
  void canGetAllRequests() throws IOException {
    // When something asks the (mocked) context for the queryParamMap,
    // it will return an empty map (since there are no query params in this case where we want all users)
    when(ctx.queryParamMap()).thenReturn(Collections.emptyMap());


    // Now, go ahead and ask the userController to getUsers
    // (which will, indeed, ask the context for its queryParamMap)
    requestController.getRequests(ctx);

    // We are going to capture an argument to a function, and the type of that argument will be
    // of type ArrayList<User> (we said so earlier using a Mockito annotation like this):
    // @Captor
    // private ArgumentCaptor<ArrayList<User>> userArrayListCaptor;
    // We only want to declare that captor once and let the annotation
    // help us accomplish reassignment of the value for the captor
    // We reset the values of our annotated declarations using the command
    // `MockitoAnnotations.openMocks(this);` in our @BeforeEach

    // Specifically, we want to pay attention to the ArrayList<User> that is passed as input
    // when ctx.json is called --- what is the argument that was passed? We capture it and can refer to it later
    verify(ctx).json(requestArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    // Check that the database collection holds the same number of documents as the size of the captured List<User>
    assertEquals(db.getCollection("donorRequests").countDocuments(), requestArrayListCaptor.getValue().size());
  }

  /* */
  @Test
  void canGetRequestsWithItemType() throws IOException {
    Map<String, List<String>> queryParams = new HashMap<>();
    // queryParams.put(ClientRequestController.ITEM_TYPE_KEY, Arrays.asList(new String[] {"food"}));
    queryParams.put(ClientRequestController.SORT_ORDER_KEY, Arrays.asList(new String[] {"desc"}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    /*when(ctx.queryParamAsClass(ClientRequestController.ITEM_TYPE_KEY, String.class))
      .thenReturn(Validator.create(String.class, "food", ClientRequestController.ITEM_TYPE_KEY));*/

    requestController.getRequests(ctx);

    verify(ctx).json(requestArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    // Confirm that all the requests passed to `json` work for food.
    for (Request request : requestArrayListCaptor.getValue()) {
    //   assertEquals("food", request.itemType);
    }
  }
  @Test
  void canGetRequestsWithFoodType() throws IOException {
    Map<String, List<String>> queryParams = new HashMap<>();
    // queryParams.put(ClientRequestController.FOOD_TYPE_KEY, Arrays.asList(new String[] {"meat"}));
    queryParams.put(ClientRequestController.SORT_ORDER_KEY, Arrays.asList(new String[] {"desc"}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    /*when(ctx.queryParamAsClass(ClientRequestController.FOOD_TYPE_KEY, String.class))
      .thenReturn(Validator.create(String.class, "meat", ClientRequestController.FOOD_TYPE_KEY));*/

    requestController.getRequests(ctx);

    verify(ctx).json(requestArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    // Confirm that all the requests passed to `json` work for food.
    for (Request request : requestArrayListCaptor.getValue()) {
    //   assertEquals("meat", request.foodType);
    }
  }

  @Test
  public void canGetRequestWithItemTypeUppercase() throws IOException {
    Map<String, List<String>> queryParams = new HashMap<>();
    // queryParams.put(ClientRequestController.ITEM_TYPE_KEY, Arrays.asList(new String[] {"FOOD"}));
    queryParams.put(ClientRequestController.SORT_ORDER_KEY, Arrays.asList(new String[] {"desc"}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    /*when(ctx.queryParamAsClass(ClientRequestController.ITEM_TYPE_KEY, String.class))
      .thenReturn(Validator.create(String.class, "FOOD", ClientRequestController.ITEM_TYPE_KEY));*/

    requestController.getRequests(ctx);

    verify(ctx).json(requestArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    // Confirm that all the requests passed to `json` work for food.
    for (Request request : requestArrayListCaptor.getValue()) {
    //   assertEquals("food", request.itemType);
    }
  }

  @Test
  void canSortAscending() throws IOException {
    Map<String, List<String>> queryParams = new HashMap<>();
    // queryParams.put(ClientRequestController.FOOD_TYPE_KEY, Arrays.asList(new String[] {"meat"}));
    queryParams.put(ClientRequestController.SORT_ORDER_KEY, Arrays.asList(new String[] {"asc"}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    /*when(ctx.queryParamAsClass(ClientRequestController.FOOD_TYPE_KEY, String.class))
      .thenReturn(Validator.create(String.class, "meat", ClientRequestController.FOOD_TYPE_KEY));*/

    requestController.getRequests(ctx);

    verify(ctx).json(requestArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    // Confirm that all the requests passed to `json` work for food.
    for (Request request : requestArrayListCaptor.getValue()) {
    //   assertEquals("meat", request.foodType);
    }
  }

  @Test
  void canSortDescending() throws IOException {
    Map<String, List<String>> queryParams = new HashMap<>();
    // queryParams.put(ClientRequestController.FOOD_TYPE_KEY, Arrays.asList(new String[] {"meat"}));
    queryParams.put(ClientRequestController.SORT_ORDER_KEY, Arrays.asList(new String[] {"desc"}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    /*when(ctx.queryParamAsClass(ClientRequestController.FOOD_TYPE_KEY, String.class))
      .thenReturn(Validator.create(String.class, "meat", ClientRequestController.FOOD_TYPE_KEY));*/

    requestController.getRequests(ctx);

    verify(ctx).json(requestArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);

    // Confirm that all the requests passed to `json` work for food.
    for (Request request : requestArrayListCaptor.getValue()) {
    //   assertEquals("meat", request.foodType);
    }
  }

  @Test
  void getRequestsByItemTypeAndFoodType() throws IOException {
    Map<String, List<String>> queryParams = new HashMap<>();
    // queryParams.put(ClientRequestController.ITEM_TYPE_KEY, Arrays.asList(new String[] {"food"}));
    // queryParams.put(ClientRequestController.FOOD_TYPE_KEY, Arrays.asList(new String[] {"fruit"}));
    when(ctx.queryParamMap()).thenReturn(queryParams);
    /*when(ctx.queryParamAsClass(ClientRequestController.ITEM_TYPE_KEY, String.class))
      .thenReturn(Validator.create(String.class, "food", ClientRequestController.ITEM_TYPE_KEY));
    when(ctx.queryParamAsClass(ClientRequestController.FOOD_TYPE_KEY, String.class))
      .thenReturn(Validator.create(String.class, "fruit", ClientRequestController.FOOD_TYPE_KEY));*/

    requestController.getRequests(ctx);

    verify(ctx).json(requestArrayListCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
    assertEquals(1, requestArrayListCaptor.getValue().size());
    for (Request request : requestArrayListCaptor.getValue()) {
    //   assertEquals("food", request.itemType);
    //   assertEquals("fruit", request.foodType);
    }
  }

  @Test
  void getRequestByID() throws IOException {
    String id = samsId.toHexString();
    when(ctx.pathParam("id")).thenReturn(id);

    requestController.getRequest(ctx);

    verify(ctx).json(requestCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
    // assertEquals("food", requestCaptor.getValue().itemType);
    assertEquals("steak", requestCaptor.getValue().description);
    // assertEquals("meat", requestCaptor.getValue().foodType);

  }

  @Test
  void getRequestsWithExistentId() throws IOException {
    String id = samsId.toHexString();
    when(ctx.pathParam("id")).thenReturn(id);

    requestController.getRequest(ctx);

    verify(ctx).json(requestCaptor.capture());
    verify(ctx).status(HttpStatus.OK);
    // assertEquals("food", requestCaptor.getValue().itemType);
    assertEquals(samsId.toHexString(), requestCaptor.getValue()._id);
  }

  @Test
  void getRequestsWithBadId() throws IOException {
    when(ctx.pathParam("id")).thenReturn("bad");

    Throwable exception = assertThrows(BadRequestResponse.class, () -> {
      requestController.getRequest(ctx);
    });

    assertEquals("The desired request id wasn't a legal Mongo Object ID.", exception.getMessage());
  }

  @Test
  void getRequestsWithNonexistentId() throws IOException {
    String id = "588935f5c668650dc77df581";
    when(ctx.pathParam("id")).thenReturn(id);

    Throwable exception = assertThrows(NotFoundResponse.class, () -> {
      requestController.getRequest(ctx);
    });

    assertEquals("The desired request was not found", exception.getMessage());
  }

  @Test
  void addRequest() throws IOException {
    String testNewRequest = "{"
        // + "\"itemType\": \"food\","
        // + "\"foodType\": \"meat\""
        + "}";
    when(ctx.bodyValidator(Request.class))
      .then(value -> new BodyValidator<Request>(testNewRequest, Request.class, javalinJackson));
    when(ctx.cookie("auth_token")).thenReturn("TOKEN");

    requestController.addNewRequest(ctx);
    verify(ctx).json(mapCaptor.capture());

    // Our status should be 201, i.e., our new user was successfully created.
    verify(ctx).status(HttpStatus.CREATED);

    //Verify that the request was added to the database with the correct ID
    Document addedRequest = db.getCollection("donorRequests")
      .find(eq("_id", new ObjectId(mapCaptor.getValue().get("id")))).first();

    // Successfully adding the request should return the newly generated, non-empty MongoDB ID for that request.
    assertNotEquals("", addedRequest.get("_id"));
    // assertEquals("food", addedRequest.get("itemType"));
    // assertEquals("meat", addedRequest.get("foodType"));
  }

  @Test
  void addRequestInsertsDateTime() throws IOException {
    String testNewRequest = "{"
        // + "\"itemType\": \"food\","
        // + "\"foodType\": \"meat\""
        + "}";
    when(ctx.bodyValidator(Request.class))
      .then(value -> new BodyValidator<Request>(testNewRequest, Request.class, javalinJackson));
    when(ctx.cookie("auth_token")).thenReturn("TOKEN");

    requestController.addNewRequest(ctx);
    verify(ctx).json(mapCaptor.capture());

    // Our status should be 201, i.e., our new user was successfully created.
    verify(ctx).status(HttpStatus.CREATED);

    //Verify that the request was added to the database with the correct ID
    Document addedRequest = db.getCollection("donorRequests")
      .find(eq("_id", new ObjectId(mapCaptor.getValue().get("id")))).first();

    // Successfully adding the request should return the newly generated, non-empty MongoDB ID for that request.
    assertNotEquals("", addedRequest.get("_id"));
    assertNotNull(addedRequest.get("dateAdded"));

    ZonedDateTime.parse(addedRequest.get("dateAdded").toString());
  }

  @Test
  void throwsForbiddenForAddBadToken() throws IOException {
    String testNewRequest = "{"
        // + "\"itemType\": \"food\","
        // + "\"foodType\": \"meat\""
        + "}";
    when(ctx.bodyValidator(Request.class))
      .then(value -> new BodyValidator<Request>(testNewRequest, Request.class, javalinJackson));
    when(ctx.cookie("auth_token")).thenReturn("BAD_TOKEN");

    assertThrows(ForbiddenResponse.class, () -> {
      requestController.addNewRequest(ctx);
    });

    // Our status should be 403, i.e., forbidden
    verify(ctx).status(HttpStatus.FORBIDDEN);
  }

  @Test
  void throwsForbiddenForAddNoToken() throws IOException {
    String testNewRequest = "{"
        // + "\"itemType\": \"food\","
        // + "\"foodType\": \"meat\""
        + "}";
    when(ctx.bodyValidator(Request.class))
      .then(value -> new BodyValidator<Request>(testNewRequest, Request.class, javalinJackson));

    assertThrows(ForbiddenResponse.class, () -> {
      requestController.addNewRequest(ctx);
    });

    // Our status should be 403, i.e., forbidden
    verify(ctx).status(HttpStatus.FORBIDDEN);
  }

  @Test
  void deleteFoundRequest() throws IOException {
    String testID = samsId.toHexString();
    when(ctx.pathParam("id")).thenReturn(testID);
    when(ctx.cookie("auth_token")).thenReturn("TOKEN");

    // Request exists before deletion
    assertEquals(1, db.getCollection("donorRequests").countDocuments(eq("_id", new ObjectId(testID))));

    requestController.deleteRequest(ctx);

    verify(ctx).status(HttpStatus.OK);

    // request is no longer in the database
    assertEquals(0, db.getCollection("donorRequests").countDocuments(eq("_id", new ObjectId(testID))));
  }

  @Test
  void tryToDeleteNotFoundRequest() throws IOException {
    String testID = samsId.toHexString();
    when(ctx.pathParam("id")).thenReturn(testID);
    when(ctx.cookie("auth_token")).thenReturn("TOKEN");

    requestController.deleteRequest(ctx);
    // Request is no longer in the database
    assertEquals(0, db.getCollection("donorRequests").countDocuments(eq("_id", new ObjectId(testID))));

    assertThrows(NotFoundResponse.class, () -> {
      requestController.deleteRequest(ctx);
    });

    verify(ctx).status(HttpStatus.NOT_FOUND);

    // Request is still not in the database
    assertEquals(0, db.getCollection("donorRequests").countDocuments(eq("_id", new ObjectId(testID))));
  }

  @Test
  void throwsForbiddenForDeleteNoToken() throws IOException {
    String testID = samsId.toHexString();
    when(ctx.pathParam("id")).thenReturn(testID);

    // Request exists before deletion
    assertEquals(1, db.getCollection("donorRequests").countDocuments(eq("_id", new ObjectId(testID))));

    assertThrows(ForbiddenResponse.class, () -> {
      requestController.deleteRequest(ctx);
    });

    verify(ctx).status(HttpStatus.FORBIDDEN);

    // Request exists after failed deletion
    assertEquals(1, db.getCollection("donorRequests").countDocuments(eq("_id", new ObjectId(testID))));
  }

  @Test
  void throwsForbiddenForDeleteBadToken() throws IOException {
    String testID = samsId.toHexString();
    when(ctx.pathParam("id")).thenReturn(testID);
    when(ctx.cookie("auth_token")).thenReturn("BAD_TOKEN");

    // Request exists before deletion
    assertEquals(1, db.getCollection("donorRequests").countDocuments(eq("_id", new ObjectId(testID))));

    assertThrows(ForbiddenResponse.class, () -> {
      requestController.deleteRequest(ctx);
    });

    verify(ctx).status(HttpStatus.FORBIDDEN);

    // Request exists after failed deletion
    assertEquals(1, db.getCollection("donorRequests").countDocuments(eq("_id", new ObjectId(testID))));
  }

  @Test
  void tryMd5Hash() throws NoSuchAlgorithmException {
    assertNotNull(requestController.md5("Hello World!"));
  }
}
