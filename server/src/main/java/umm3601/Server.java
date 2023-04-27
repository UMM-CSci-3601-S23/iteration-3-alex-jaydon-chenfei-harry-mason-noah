package umm3601;

import java.util.Arrays;

import com.mongodb.MongoClientSettings;
import com.mongodb.ServerAddress;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;

import org.bson.UuidRepresentation;

import io.javalin.Javalin;
import io.javalin.plugin.bundled.RouteOverviewPlugin;
import umm3601.request.ClientRequestController;
import umm3601.request.DonorRequestController;
import umm3601.user.UserController;

public class Server {

  private static final int SERVER_PORT = 4568;

  public static void main(String[] args) {
    // Check for the presence of the `--no-auth` command line flag if this flag
    // is present, authorization will require the dummy `TOKEN` token instead
    // of the proper auth tokens.
    boolean doDummyAuth = Arrays.asList(args).contains("--no-auth");

    // Get the MongoDB address and database name from environment variables and
    // if they aren't set, use the defaults of "localhost" and "dev".
    String mongoAddr = System.getenv().getOrDefault("MONGO_ADDR", "localhost");
    String databaseName = System.getenv().getOrDefault("MONGO_DB", "dev");

    // Setup the MongoDB client object with the information we set earlier
    MongoClient mongoClient
      = MongoClients.create(MongoClientSettings
        .builder()
        .applyToClusterSettings(builder -> builder.hosts(Arrays.asList(new ServerAddress(mongoAddr))))
        // Old versions of the mongodb-driver-sync package encoded UUID values (universally unique identifiers) in
        // a non-standard way. This option says to use the standard encoding.
        // See: https://studio3t.com/knowledge-base/articles/mongodb-best-practices-uuid-data/
        .uuidRepresentation(UuidRepresentation.STANDARD)
        .build());

    // Get the database
    MongoDatabase database = mongoClient.getDatabase(databaseName);

    // Construct the authentication checking object
    Authentication auth = new Authentication(doDummyAuth);

    // Initialize dependencies
    UserController userController = new UserController(database);
    ClientRequestController clientRequestController = new ClientRequestController(database, auth);
    DonorRequestController donorRequestController = new DonorRequestController(database, auth);

    Javalin server = Javalin.create(config ->
      config.plugins.register(new RouteOverviewPlugin("/api"))
    );
    /*
     * We want to shut the `mongoClient` down if the server either
     * fails to start, or when it's shutting down for whatever reason.
     * Since the mongClient needs to be available throughout the
     * life of the server, the only way to do this is to wait for
     * these events and close it then.
     */
    server.events(event -> {
      event.serverStartFailed(mongoClient::close);
      event.serverStopped(mongoClient::close);
    });
    Runtime.getRuntime().addShutdownHook(new Thread(server::stop));

    server.start(SERVER_PORT);

    // List users, filtered using query parameters
    server.get("/api/users", userController::getUsers);

    // Get the specified user
    server.get("/api/users/{id}", userController::getUser);

    // Delete the specified user
    server.delete("/api/users/{id}", userController::deleteUser);

    // Add new user with the user info being in the JSON body
    // of the HTTP request
    server.post("/api/users", userController::addNewUser);

    //Request api endpoints

    //Get a request by a specific ID
    server.get("/api/clientRequests/{id}", clientRequestController::getRequest);
    server.get("/api/donorRequests/{id}", donorRequestController::getRequest);
    //List requests, filtered using query parameters
    server.get("/api/clientRequests", clientRequestController::getRequests);
    server.get("/api/donorRequests", donorRequestController::getRequests);

    // Add a new request
    server.post("/api/clientRequests", clientRequestController::addNewRequest);
    server.post("/api/donorRequests", donorRequestController::addNewRequest);

    //Deleting requests
    server.delete("/api/clientRequests/{id}", clientRequestController::deleteRequest);
    server.delete("/api/donorRequests/{id}", donorRequestController::deleteRequest);

    // Magically grant authorization for the demo
    // DO NOT USE THIS! THIS IS A TERRIBLE IDEA AND NOT THE WAY SECURITY SHOULD EVER WORK, THIS IS FOR THE DEMO ONLY
    server.get("/api/auth", auth::grant);


    // This catches any uncaught exceptions thrown in the server
    // code and turns them into a 500 response ("Internal Server
    // Error Response"). In general you'll like to *never* actually
    // return this, as it's an instance of the server crashing in
    // some way, and returning a 500 to your user is *super*
    // unhelpful to them. In a production system you'd almost
    // certainly want to use a logging library to log all errors
    // caught here so you'd know about them and could try to address
    // them.
    /*
    server.exception(Exception.class, (e, ctx) -> {
      throw new InternalServerErrorResponse(e.toString());
    });
  */
  }
}
