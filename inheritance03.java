//Creator → language
class Creator
{
    public Creator()
    {
        System.out.println("Constructor of Creator");
    }
    public void creator1()
    {
        System.out.println("The creator of web devlopment uses:");
    }
    public void creator2()
    {
        System.out.println("The creator of Ai uses:");
    }
    public void creator3()
    {
        System.out.println("The creator of backend developer uses:");
    }
}
class language extends  Creator
{
    public language()
    {
       System.out.println("Constructor of language");
    }
    public void language1()
    {
        System.out.println("HTML,CSS and JAVASCRIPT");
    }
    public void language2()
    {
        System.out.println("python");
    }
    public void language3()
    {
        System.out.println("java");
    }
}
public class inheritance03
{
    public static void main(String[] args) {
        language lg= new language();
        lg.creator1();
        lg.language1();

        lg.creator2();
        lg.language2();

        lg.creator3();
        lg.language3();
    }
}