//based on inhertance - resturent and pizza 

class resturent
{
    public resturent()
    {
        //construtor
    }
    public void storename()
    {
        System.out.println("Enter the name of the store :");
    }
    public void ordername()
    {
        System.out.println("Place your order:");
    }
    public void rating()
    {
        System.out.println("Please give your rating: ");
    }
    public void price()
    {
        System.out.println("Which size of pizza you want to buy: ");
    }
    public void review()
    {
        System.out.println("Please enter your review.");
    }
}
class pizza extends resturent
{
    public pizza()
    {
        //constructor
    }
    public void storename()
    {
        System.out.println("The name of the store is :");
    }
    public void ordername()
    {
        System.out.println("The name of the order is Pizza");
    }
}