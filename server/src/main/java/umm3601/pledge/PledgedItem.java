package umm3601.pledge;

import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({"VisibilityModifier"})

public class PledgedItem {
  @ObjectId @Id

  @SuppressWarnings({"MemberName"})

  public String _id;

  public String itemName;
  public int amountNeeded;

  @Override
  public boolean equals(Object obj) {
    if (!(obj instanceof PledgedItem)) {
      return false;
    }
    PledgedItem other = (PledgedItem) obj;
    return _id.equals((other._id));
  }

  @Override
  public int hashCode() {
    return _id.hashCode();
  }

}
