class Addition
{
    public Addition()
    {
        //constructor
    }
    public void add(int a,int b)
    {
        int s = a+b;
        System.out.println("Result1=" +s);
    }
    public void add(float a,float b)
    {
        float s= a+b;
        System.out.println("Result2="+s);
    }
    public void add(int a,float b)
    {
        float  s=a+b;
        System.out.println("Result 3="+s);
    }
    public void add(int a,double b)
    {
        double s=a+b;
        System.out.println("Result 4="+s);
    } 
}
public class method_overloading
{
    public static void main(String args[])
    {
        Addition ad = new Addition();
        ad.add(7,3);
        ad.add(4,4.5);
        ad.add(3,6.7);
        ad.add(5,8.9);
    }
}