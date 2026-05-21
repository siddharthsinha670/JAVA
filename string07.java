//contant compare krna hai

class String07
{
    public static void main(String args[])
    {
        String str = "Siddharth";
        String str2 = new String ("Siddharth");
        if(str.equals(str2)) /*yaha pe (str==str2 nahi hoga kyuki isme compiler str ko dekhta hai 
        aur str2 ko aur wo to equal hai hi nahi isi liye note equal ata hai ) */
        {
            System.out.println("The string is equal");
        }
        else{
            System.out.println("The string is not equal");
        }
    } 
}
