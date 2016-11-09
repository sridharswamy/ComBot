package selenium.tests;

import static org.junit.Assert.*;
import java.util.concurrent.TimeUnit;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import io.github.bonigarcia.wdm.ChromeDriverManager;
import org.junit.FixMethodOrder;
import org.junit.runners.MethodSorters;


@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class BotTest
{
	
	private static String id = "sadoshi@ncsu.edu";
	private static String pwd = "******";
	private static WebDriver driver;
	
	@BeforeClass
	public static void setUp() throws Exception 
	{
		//go to slack and login
		ChromeDriverManager.getInstance().setup();
		driver = new ChromeDriver();
		driver.get("https://seteamhq.slack.com/");
		
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

		WebElement email = driver.findElement(By.id("email"));
		WebElement pw = driver.findElement(By.id("password"));
		
		//send email and password
		email.sendKeys(id);
		pw.sendKeys(pwd);
		
		//sign in
		WebElement signin = driver.findElement(By.id("signin_btn"));
		signin.click();
		
		wait.until(ExpectedConditions.titleContains("general"));
		
	}
	
	
	@AfterClass
	public static void  tearDown() throws Exception
	{
		driver.close();
		driver.quit();
	}

	
	
	@Test
	public void fetch_url_invalid() throws Exception
	{
		
		WebDriverWait wait = new WebDriverWait(driver, 30);
		
		//go to testing channel
		driver.get("https://seteamhq.slack.com/messages/testing");
		wait.until(ExpectedConditions.titleContains("testing"));

		// Type something to be sent
		WebElement messageBot = driver.findElement(By.id("message-input"));
		
		//fetch repository details
		messageBot.sendKeys("fetch https://gsiddopo ");
		messageBot.sendKeys(Keys.RETURN);
		
		wait.withTimeout(4, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
		

		WebElement chat = null;
		
		// Get last message body. We try it no of times as we get StaleElementReferenceException
		int attempts = 10;
		while(attempts -- >0)
		{	
			try{
			     chat = driver.findElement(By.xpath("(//div[@class='message_content '])[last()]/span[@class='message_body']"));			
			}
			catch(org.openqa.selenium.StaleElementReferenceException ex)
			{
			    chat = driver.findElement(By.xpath("(//div[@class='message_content '])[last()]/span[@class='message_body']"));
			}
		
		}
		
		//check if we get last message
		assertNotNull(chat);
		
		//Failure message
		String msg = "The URL you entered is invalid. Please enter valid GitHub URL!";
		
		//Reply from bot
		String rep = chat.getText();
		
		// check if the reply from bot contains the failure message
		boolean val = rep.indexOf(msg)!=-1;
		assertTrue(val);	
	}
	
	
	
	@Test
	public void invalid_filename() throws Exception
	{
		WebDriverWait wait = new WebDriverWait(driver, 30);	
		
		// get recent commits
		WebElement messageBot = driver.findElement(By.id("message-input"));
		messageBot.sendKeys("file saddas recent 1");
		messageBot.sendKeys(Keys.RETURN);
		
		wait.withTimeout(10, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
		
		
		WebElement chat = null;
		
		int attempts = 10;
		while(attempts-- >0)
		{	
			try{
			     chat = driver.findElement(By.xpath("(//div[@class='message_content '])[last()]/span[@class='message_body']"));
				
			}
			catch(org.openqa.selenium.StaleElementReferenceException ex)
			{
			    chat = driver.findElement(By.xpath("(//div[@class='message_content '])[last()]/span[@class='message_body']"));
				
			}
		
		}
		
		//check if we get last message
		assertNotNull(chat);
		
		
		//Failure message
		String msg = "Sorry, I couldn't locate that file!";
		
		//Reply from bot
		String rep = chat.getText();
		
		// check if the reply from bot contain the failure message
		boolean val = rep.indexOf(msg)!=-1;
		assertTrue(val);
		
	}
	
	
	@Test
	public void invalid_command() throws Exception
	{
		WebDriverWait wait = new WebDriverWait(driver, 30);	
		
		// get recent commits
		WebElement messageBot = driver.findElement(By.id("message-input"));
		messageBot.sendKeys("file file1 to");
		messageBot.sendKeys(Keys.RETURN);
		
		wait.withTimeout(10, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
		
		
		WebElement chat = null;
		
		int attempts = 10;
		while(attempts-- >0)
		{	
			try{
			     chat = driver.findElement(By.xpath("(//div[@class='message_content '])[last()]/span[@class='message_body']"));
				
			}
			catch(org.openqa.selenium.StaleElementReferenceException ex)
			{
			    chat = driver.findElement(By.xpath("(//div[@class='message_content '])[last()]/span[@class='message_body']"));
				
			}
		
		}
		
		//check if we get last message
		assertNotNull(chat);		
		
		//Failure message
		String msg = "Invalid command format!";
		
		//Reply from bot
		String rep = chat.getText();
		
		// check if the reply from bot contains the failure message
		boolean val = rep.indexOf(msg)!=-1;
		assertTrue(val);
		
	}
	

	
	@Test
	public void fetch_url_valid() throws Exception
	{
		
		WebDriverWait wait = new WebDriverWait(driver, 30);
		
		//go to testing channel
		driver.get("https://seteamhq.slack.com/messages/testing");
		wait.until(ExpectedConditions.titleContains("testing"));

		// Type something to be sent
		WebElement messageBot = driver.findElement(By.id("message-input"));
		
		//fetch repository details
		
		messageBot.sendKeys("fetch https://github.com/sridharswamy/ComBot");
		messageBot.sendKeys(Keys.RETURN);
		
		wait.withTimeout(4, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
		

		WebElement chat = null;
		
		
		// Get last message body. We try it no of times as we get StaleElementReferenceException
		int attempts = 10;
		while(attempts -- >0)
		{	
			try{
			     chat = driver.findElement(By.xpath("(//div[@class='message_content '])[last()]/span[@class='message_body']"));			
			}
			catch(org.openqa.selenium.StaleElementReferenceException ex)
			{
			    chat = driver.findElement(By.xpath("(//div[@class='message_content '])[last()]/span[@class='message_body']"));
			}
		
		}
		
		//check if we get last message
		assertNotNull(chat);
		
		//Success messages
		String msg = "Fetching successfully completed!";
		//String msg[] = {"Fetching commit history from the repo","Fetching successfully completed!"};
		
		//Reply from bot
		String rep = chat.getText();
		
		// check if the reply from bot contains the success message
		//boolean val = rep.indexOf(msg[0])!=-1 || rep.indexOf(msg[1])!=-1;
		boolean val = rep.indexOf(msg)!=-1 ;
		assertTrue(val);	
	
	}
	
	@Test
	public void valid_recent_commit() throws Exception
	{
		WebDriverWait wait = new WebDriverWait(driver, 30);	
		
		// get recent commits
		WebElement messageBot = driver.findElement(By.id("message-input"));
		messageBot.sendKeys("file bot.js recent 3");
		messageBot.sendKeys(Keys.RETURN);
		
		wait.withTimeout(10, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
		
		
		WebElement chat = null;
		
		int attempts = 10;
		while(attempts-- >0)
		{	
			try{
			     chat = driver.findElement(By.xpath("(//div[@class='message_content '])[last()]/span[@class='message_body']"));
				
			}
			catch(org.openqa.selenium.StaleElementReferenceException ex)
			{
			    chat = driver.findElement(By.xpath("(//div[@class='message_content '])[last()]/span[@class='message_body']"));
				
			}
		
		}
		
		//check if we get last message
		assertNotNull(chat);
		
		
		//Failure message
		String msg = "Sorry, I couldn't locate that file!";
		
		//Reply from bot
		String rep = chat.getText();
		
		// check if the reply from bot does not contain the failure message
		boolean val = rep.indexOf(msg)==-1;
		assertTrue(val);
		
		// split multiple lines reply. Last n-2 lines will be committer details
		String reps[] = rep.split("\n");
		int n = reps.length;	
		
		
		// desired output
		String repbot[] = {"snswamy@ncsu.edu: Wed Nov 09 2016 01:37:43 GMT-0500 (EST)",
		"mehtakash93@gmail.com: Tue Nov 08 2016 23:27:45 GMT-0500 (EST)",
		"siddoshi93@gmail.com: Thu Oct 20 2016 17:47:09 GMT-0400 (EDT)"};

	
		
		
		//check if last n-2 lines are k committers required
		assertTrue(n-2==repbot.length);
		
		int i=0;
		while(i<repbot.length)
		{
			// check if actual ouput of committer details is equal to real output of committer details
			val = reps[i+2].indexOf(repbot[i])!=-1;
			assertTrue(val);
			i++;
		}
		
	}
	
	
	@Test
	public void valid_top_commit() throws Exception
	{
		WebDriverWait wait = new WebDriverWait(driver, 30);	
		
		// get recent commits
		WebElement messageBot = driver.findElement(By.id("message-input"));
		messageBot.sendKeys("file bot.js top 3");
		messageBot.sendKeys(Keys.RETURN);
		
		wait.withTimeout(10, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
		
		
		WebElement chat = null;
		
		int attempts = 10;
		while(attempts-- >0)
		{	
			try{
			     chat = driver.findElement(By.xpath("(//div[@class='message_content '])[last()]/span[@class='message_body']"));
				
			}
			catch(org.openqa.selenium.StaleElementReferenceException ex)
			{
			    chat = driver.findElement(By.xpath("(//div[@class='message_content '])[last()]/span[@class='message_body']"));
				
			}
		
		}
		
		//check if we get last message
		assertNotNull(chat);
		
		
		//Failure message
		String msg = "Sorry, I couldn't locate that file!";
		
		//Reply from bot
		String rep = chat.getText();
		
		// check if the reply from bot does not contain the failure message
		boolean val = rep.indexOf(msg)==-1;
		assertTrue(val);
		
		// split multiple lines reply. Last n-2 lines will be committer details
		String reps[] = rep.split("\n");
		int n = reps.length;	

		// desired output
		String repbot[] = {"mehtakash93@gmail.com: 6 commits","snswamy@ncsu.edu: 3 commits","akshaynayak2012@gmail.com: 2 commits"};
		
		
		//check if last n-2 lines are k committers required
		assertTrue(n-2==repbot.length);
		
		int i=0;
		while(i<repbot.length)
		{
			// check if actual ouput of committer details is equal to real output of committer details
			val = reps[i+2].indexOf(repbot[i])!=-1;
			assertTrue(val);
			i++;
		}
		
	}
	

	
	@Test
	public void valid_organization_count() throws Exception
	{
		WebDriverWait wait = new WebDriverWait(driver, 30);	
		
		// get recent commits
		WebElement messageBot = driver.findElement(By.id("message-input"));
		messageBot.sendKeys("orgContributors bot.js");
		messageBot.sendKeys(Keys.RETURN);
		
		wait.withTimeout(10, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
		
		
		WebElement chat = null;
		
		int attempts = 10;
		while(attempts-- >0)
		{	
			try{
			     chat = driver.findElement(By.xpath("(//div[@class='message_content '])[last()]/span[@class='message_body']"));
				
			}
			catch(org.openqa.selenium.StaleElementReferenceException ex)
			{
			    chat = driver.findElement(By.xpath("(//div[@class='message_content '])[last()]/span[@class='message_body']"));
				
			}
		
		}
		
		//check if we get last message
		assertNotNull(chat);
		
		
		//Failure message
		String msg = "Sorry, I couldn't locate that file!";
		
		//Reply from bot
		String rep = chat.getText();
		
		// check if the reply from bot does not contain the failure message
		boolean val = rep.indexOf(msg)==-1;
		assertTrue(val);
		
		// split multiple lines reply. 
		String reps[] = rep.split("\n");
		int n = reps.length;	
		
		// desired output
		
		String repbot[] = {"Cloudera: 3","Lucidworks: 6","NCSU: 1","SLAC: 2"};
			
		//check if last n-1 lines are organizations 
		assertTrue(n-1==repbot.length);
		
		int i=0;
		while(i<repbot.length)
		{
			// check if actual ouput of committer details is equal to real output of committer details
			val = reps[i+1].indexOf(repbot[i])!=-1;
			assertTrue(val);
			i++;
		}
	}	
}
