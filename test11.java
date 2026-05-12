class addition
{
    public addition()
    {
        //constructor
    }
    public void add(int a,int b)
    {
        int s =a+b;
        System.out.println("Result1:"+s);
    }
    public void add(int a,int b,int c)
    {
        int s = a+b+c;
        System.out.println("Result2 :"+s);
    }
    public void add(int a,int b,int c,int d)
    {
        int s=a+b+c+d;
        System.out.println("Result3:"+s);
    }
}
public class test11
{
    public static void main(String[] args) {
        addition ad = new addition();
        ad.add(2,9,4,8);
        ad.add(2,4);
        ad.add(2,4,6);
    }
}