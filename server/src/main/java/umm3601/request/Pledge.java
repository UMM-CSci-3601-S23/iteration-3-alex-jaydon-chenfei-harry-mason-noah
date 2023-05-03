package umm3601.request;

import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({"VisibilityModifier"})

public class Pledge {
  @ObjectId @Id

  @SuppressWarnings({"MemberName"})

  public String _id;

  public String name;
  public int amount;
  public String timeSlot;
  public String comment;
  public String itemId;

  @Override
  public boolean equals(Object obj) {
    if (!(obj instanceof Pledge)) {
      return false;
    }
    Pledge other = (Pledge) obj;
    return _id.equals((other._id));
  }

  @Override
  public int hashCode() {
    return _id.hashCode();
  }
}

