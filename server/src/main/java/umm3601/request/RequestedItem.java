package umm3601.request;

import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({"VisibilityModifier"})

public class RequestedItem {
  @ObjectId @Id

  @SuppressWarnings({"MemberName"})

  public String _id;

  public String name;
  public int amount;

  @Override
  public boolean equals(Object obj) {
    if (!(obj instanceof RequestedItem)) {
      return false;
    }
    RequestedItem other = (RequestedItem) obj;
    return _id.equals((other._id));
  }

  @Override
  public int hashCode() {
    return _id.hashCode();
  }

}
