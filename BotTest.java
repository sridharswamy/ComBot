package selenium.tests;

import static org.junit.Assert.*;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.htmlunit.HtmlUnitDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.FluentWait;
import org.openqa.selenium.support.ui.WebDriverWait;

import com.thoughtworks.selenium.Wait;

import io.github.bonigarcia.wdm.ChromeDriverManager;


public class BotTest
{
	private static WebDriver driver;
	
	@BeforeClass
	public static void setUp() throws Exception 
	{
		//driver = new HtmlUnitDriver();
		ChromeDriverManager.getInstance().setup();
		driver = new ChromeDriver();
	}
	
	@AfterClass
	public static void  tearDown() throws Exception
	{
		driver.close();
		driver.quit();
	}

	
	@Test
	public void URL_fetch() throws Exception
	{
		driver.get("https://seteamhq.slack.com/");
		
		WebDriverWait wait = new WebDriverWait(driver, 30);
		wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("signin_btn")));

		WebElement email = driver.findElement(By.id("email"));
		WebElement pw = driver.findElement(By.id("password"));
		
		email.sendKeys("sadoshi@ncsu.edu");
		pw.sendKeys("****");

		
		WebElement signin = driver.findElement(By.id("signin_btn"));
		signin.click();
		
		wait.until(ExpectedConditions.titleContains("general"));
		
		driver.get("https://seteamhq.slack.com/messages/testing");
		wait.until(ExpectedConditions.titleContains("testing"));

		// Type something
		WebElement messageBot = driver.findElement(By.id("message-input"));
		messageBot.sendKeys("fetch mock.json");
		messageBot.sendKeys(Keys.RETURN);
		
		
		wait.withTimeout(3, TimeUnit.SECONDS).ignoring(StaleElementReferenceException.class);
		
		WebElement chat = null;
		
		int attempts = 2;
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
		
		String msg="Fetching successfully completed!";
		boolean val = chat.getText().indexOf(msg)!=-1;
		
		assertNotNull(chat);
		assertTrue(val);	
	}
	
	
	
}
