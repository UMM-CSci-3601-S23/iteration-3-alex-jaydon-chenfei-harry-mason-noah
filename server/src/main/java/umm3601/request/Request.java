package umm3601.request;

import org.mongojack.Id;
import org.mongojack.ObjectId;

@SuppressWarnings({"VisibilityModifier"})

public class Request {
  @ObjectId @Id

  @SuppressWarnings({"MemberName"})

  public String _id;

  public String name;
  public String[] selections;
  public String description;
  public String dateAdded;
  public String diaperSize;
  public Boolean incomeValid;

  @Override
  public boolean equals(Object obj) {
    if (!(obj instanceof Request)) {
      return false;
    }
    Request other = (Request) obj;
    return _id.equals((other._id));
  }

  @Override
  public int hashCode() {
    return _id.hashCode();
  }

}
