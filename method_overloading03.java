class Addition01
{
    public Addition01()
    {
        //consturctor
    }
    public void add(int a,int b)
    {
        int s = a+b;
        System.out.println("result1="+s);
    }
    public void add(int a,int b,int c)
    {
        int s = a+b+c;
        System.out.println("Result 2:"+s);
    }
    public void add(int a,int b,int c,int d)
    {
        int s = a+b+c+d;
        System.out.println("Result 3:"+s);
    }
}
public class method_overloading03
{
    public static void main(String[] args) {
        Addition01 ad = new Addition01();
        ad.add(2,3,4,5);
        ad.add(4,5);
        ad.add(1,2,4);
    }
}