import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import com.mongodb.client.result.DeleteResult;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.NotFoundResponse;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.mongodb.client.MongoCollection;
import org.bson.Document;
import umm3601.Authentication;
import umm3601.request.RequestedItemController;
import umm3601.request.RequestedItem;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

public class RequestedItemControllerTest {

    @Mock
    private MongoCollection<RequestedItem> itemCollection;

    @Mock
    private Context ctx;

    @Mock
    private Authentication auth;

    private RequestedItemController requestedItemController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        requestedItemController = new RequestedItemController(itemCollection, auth);
    }

    // Test for getItem method
    // ...add the previous tests here...

    // Test for getItems method
    @Test
    public void testGetItems() {
        RequestedItem item1 = new RequestedItem();
        RequestedItem item2 = new RequestedItem();
        ArrayList<RequestedItem> items = new ArrayList<>(Arrays.asList(item1, item2));

        when(itemCollection.find(any())).thenReturn(items);

        requestedItemController.getItems(ctx);

        verify(ctx).json(items);
        verify(ctx).status(200);  // HttpStatus.OK is 200
    }

    // Test for addNewItem method
    @Test
    public void testAddNewItem() {
        RequestedItem newItem = new RequestedItem();
        newItem.name = "testItem";
        newItem.amount = 10;

        when(ctx.bodyValidator(RequestedItem.class).get()).thenReturn(newItem);
        when(itemCollection.findOne(any())).thenReturn(null);

        requestedItemController.addNewItem(ctx);

        verify(ctx).json(any(Map.class)); // as we are returning a map with the id, use any Map
        verify(ctx).status(201);  // HttpStatus.CREATED is 201
    }

    // Test for deleteItem method
    @Test
    public void testDeleteItem() {
        String validId = new ObjectId().toString();
        DeleteResult deleteResult = mock(DeleteResult.class);

        when(ctx.pathParam("id")).thenReturn(validId);
        when(itemCollection.deleteOne(eq("_id", new ObjectId(validId)))).thenReturn(deleteResult);
        when(deleteResult.getDeletedCount()).thenReturn(1L);

        requestedItemController.deleteItem(ctx);

        verify(ctx).status(200);  // HttpStatus.OK is 200
    }

    @Test
public void testDeleteItem_NotFound() {
    String validId = new ObjectId().toString();
    DeleteResult deleteResult = mock(DeleteResult.class);

    when(ctx.pathParam("id")).thenReturn(validId);
    when(itemCollection.deleteOne(eq("_id", new ObjectId(validId)))).thenReturn(deleteResult);
    when(deleteResult.getDeletedCount()).thenReturn(0L);

    try {
        requestedItemController.deleteItem(ctx);
    } catch (Exception e) {
        assertEquals(NotFoundResponse.class, e.getClass());
        assertEquals(
            "Was unable to delete ID "
                + validId
                + "; perhaps illegal ID or an ID for an item not in the system?",
            e.getMessage());
    }
}

// Test for addNewItem method when item already exists
@Test
public void testAddNewItem_ItemExists() {
    RequestedItem newItem = new RequestedItem();
    newItem.name = "testItem";
    newItem.amount = 10;

    when(ctx.bodyValidator(RequestedItem.class).get()).thenReturn(newItem);
    when(itemCollection.findOne(any())).thenReturn(newItem);

    requestedItemController.addNewItem(ctx);

    verify(ctx).status(200);  // HttpStatus.OK is 200
}

// Test for getItem when Invalid ObjectId is given
@Test
public void testGetItem_InvalidObjectId() {
    String invalidId = "invalidId";

    when(ctx.pathParam("id")).thenReturn(invalidId);

    try {
        requestedItemController.getItem(ctx);
    } catch (Exception e) {
        assertEquals(BadRequestResponse.class, e.getClass());
        assertEquals("The desired request id wasn't a legal Mongo Object ID.", e.getMessage());
    }
}

