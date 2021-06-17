#include <iostream>
#include "opencv2/highgui/highgui.hpp"
#include "opencv2/imgproc/imgproc.hpp"
#include <math.h>
#include <errno.h>
#include <arpa/inet.h>
#include <unistd.h>

using namespace cv;
using namespace std;

double precisionToCenter(Point* topLeft, Point* topRight, Point* botRight, Point* impact, Mat& imgOriginal);
Point* detectObject(Mat& imgThresholded);
void cross(Mat& img, int posX, int posY, Scalar color);
void border(Mat& img, int bordersize, Scalar color);
int sendScore(int score, int argc, char** argv);


void border(Mat& img, int bordersize, Scalar color){
	line(img, Point(0, 0), Point(img.size().width, 0), color, bordersize);
   line(img, Point(img.size().width, 0), Point(img.size().width, img.size().height), color, bordersize);
   line(img, Point(0, img.size().height), Point(img.size().width, img.size().height), color, bordersize);
   line(img, Point(0, 0), Point(0, img.size().height), color, bordersize);
}

void cross(Mat& img, int posX, int posY, Scalar color){
	line(img, Point(posX-10, posY), Point(posX+10, posY), color, 3);
   line(img, Point(posX, posY-10), Point(posX, posY+10), color, 3);
}

//Answer in percent, relative to the distance between the two top target dots
double precisionToCenter(Point* topLeft, Point* topRight, Point* botRight, Point* impact, Mat& imgOriginal){
	
	int centerX = ((*topLeft).x+(*botRight).x)/2;
	int centerY = ((*topLeft).y+(*botRight).y)/2;
	cross(imgOriginal, centerX, centerY, Scalar(255, 255, 255));
	
	double distBetweenTopDots = sqrt( ((*topLeft).x-(*topRight).x)*((*topLeft).x-(*topRight).x)  +  ((*topLeft).y-(*topRight).y)*((*topLeft).y-(*topRight).y) );
	
	double distBetweenTargetAndCenter = sqrt( ((centerX-(*impact).x)*(centerX-(*impact).x)) + ((centerY-(*impact).y)*(centerY-(*impact).y)) );

	double accuracy = 100-(distBetweenTargetAndCenter/distBetweenTopDots)*100;
	
	if (accuracy < 0){
		accuracy = 0;	
	}
	return accuracy;

}


//Detect a single object
 	Point* detectObject(Mat& imgThresholded){
		
		int posX = -1;
   	int posY = -1;    		
		
		//Calculate the moments of the thresholded image
  		Moments oMoments = moments(imgThresholded);

   	double dM01 = oMoments.m01;
  		double dM10 = oMoments.m10;
  		double dArea = oMoments.m00;

   	// if the area <= 10000, I consider that the there are no object in the image and it's because of the noise, the area is not zero 
  		if (dArea > 10000)
  		{
   		//calculate the position of the ball
   		posX = dM10 / dArea;
   		posY = dM01 / dArea;        
		}

   	imshow("Thresholded Image", imgThresholded); //show the thresholded image
   	return new Point(posX, posY);
	}
	
	
	
	
	
	
	
	int sendScore(int score, int argc, char** argv){
 
    int sockfd = 0, n = 0;
    char recvBuff[1024];
    struct sockaddr_in serv_addr; 

    if(argc < 2)
    {
        printf("\n Usage: %s <ip of server> \n",argv[0]);
        return 1;
    } 

    memset(recvBuff, '0',sizeof(recvBuff));
    if((sockfd = socket(AF_INET, SOCK_STREAM, 0)) < 0)
    {
        printf("\n Error : Could not create socket \n");
        return 1;
    } 

    memset(&serv_addr, '0', sizeof(serv_addr)); 

    serv_addr.sin_family = AF_INET;
    serv_addr.sin_port = htons(4001); 

    if(inet_pton(AF_INET, argv[1], &serv_addr.sin_addr)<=0)
    {
        printf("\n inet_pton error occured\n");
        return 1;
    } 
    printf("connecting...\n");
    if( connect(sockfd, (struct sockaddr *)&serv_addr, sizeof(serv_addr)) < 0)
    {
       printf("\n Error : Connect Failed \n");
       return 1;
    } 
    printf("connected\n");
    
    char sendBuff[1025];
    memset(sendBuff, '0', sizeof(sendBuff)); 

	//TODO: mettre score
	//int score = 57;


	snprintf(sendBuff, sizeof(sendBuff), "%d\r\n", score);
	printf("sending %s", sendBuff);
        write(sockfd, sendBuff, strlen(sendBuff));

	printf("send\n");
	return 0;
	}




int main( int argc, char** argv )
{

   VideoCapture cap(0); //capture the video from webcam

   if ( !cap.isOpened() )  // if not success, exit program
   {
      cout << "Cannot open the web cam" << endl;
		return -1;
 	}

	//-------------------------------------------------------------------------------------------------- HSV range for object detection
   namedWindow("Balle", CV_WINDOW_AUTOSIZE); //create a window called "Reperes_de_cible"

	int iLowH = 0;
	int iHighH = 20;

  	int iLowS = 140; 
 	int iHighS = 255;

  	int iLowV = 81;
 	int iHighV = 255;

  	//Create trackbars in "Reperes_de_cibles" window
 	createTrackbar("LowH", "Balle", &iLowH, 179); //Hue (0 - 179)
 	createTrackbar("HighH", "Balle", &iHighH, 179);

  	createTrackbar("LowS", "Balle", &iLowS, 255); //Saturation (0 - 255)
 	createTrackbar("HighS", "Balle", &iHighS, 255);

 	createTrackbar("LowV", "Balle", &iLowV, 255);//Value (0 - 255)
 	createTrackbar("HighV", "Balle", &iHighV, 255);


	//-------------------------------------------------------------------------------------------------- HSV range for target detection
	namedWindow("Reperes_de_cible", CV_WINDOW_AUTOSIZE); //create a window called "Balle"
	
	int targetLowH = 85;
	int targetHighH = 104;

  	int targetLowS = 47; 
 	int targetHighS = 106;

  	int targetLowV = 116;
 	int targetHighV = 167;

  	//Create trackbars in "Balle" window
 	createTrackbar("LowH", "Reperes_de_cible", &targetLowH, 179); //Hue (0 - 179)
 	createTrackbar("HighH", "Reperes_de_cible", &targetHighH, 179);

  	createTrackbar("LowS", "Reperes_de_cible", &targetLowS, 255); //Saturation (0 - 255)
 	createTrackbar("HighS", "Reperes_de_cible", &targetHighS, 255);

 	createTrackbar("LowV", "Reperes_de_cible", &targetLowV, 255);//Value (0 - 255)
 	createTrackbar("HighV", "Reperes_de_cible", &targetHighV, 255);
 	


	//-------------------------------------------------------------------------------------------------- Rest of the code

  	//Capture a temporary image from the camera
 	Mat imgTmp;
 	cap.read(imgTmp);
 	
 	
	int frame_since_ball_seen = 0; 	
 	int frame_to_wait_before_sending_score = 10;
 	int frame_since_score_sent = 0; 	
 	int frame_to_wait_before_ready_to_see_ball_again = 200;
 	

	//Permet d'eviter de chercher les 3 reperes de la cible, et l'on ne se concentre alors que sur la balle avec une cible fixe
	bool SEARCH_BALL_ONLY = false;
	if (argc >= 3){
		SEARCH_BALL_ONLY = true;
	}	
 	
 	
 	Point* target = new Point(-1, -1);
 	Point* topLeft = new Point(-1, -1);
 	Point* topRight = new Point(-1, -1);
 	Point* botRight = new Point(-1, -1);
 	bool isConfirmed = false;	//When the coordinates are almost correct, locks them by setting to true 
 	
 	if (SEARCH_BALL_ONLY){
 		(*topLeft).x = 200;
 		(*topLeft).y = 150;
 		(*topRight).x = 400;
 		(*topRight).y = 150;
 		(*botRight).x = 400;
 		(*botRight).y = 350;
		isConfirmed = true;	//Ignore the three points recognition, we search ONLY the ball
 	}

 	
  	while (true)
   {
		Mat imgOriginal;
		
		 	
			if (!isConfirmed){
				(*topLeft).x = -1;
 				(*topLeft).y = -1;
 				(*topRight).x = -1;
 				(*topRight).y = -1;
 				(*botRight).x = -1;
 				(*botRight).y = -1;
			} 			
 			
 			(*target).x = -1;
 			(*target).y = -1;

     	bool bSuccess = cap.read(imgOriginal); // read a new frame from video
      if (!bSuccess) //if not success, break loop
      {
      	cout << "Cannot read a frame from video stream" << endl;
         break;
      }

		Mat imgHSV;
   	cvtColor(imgOriginal, imgHSV, COLOR_BGR2HSV); //Convert the captured frame from BGR to HSV
 
 		//Target detection
		if (isConfirmed == false){
  			Mat imgTargetThresholded;
   		inRange(imgHSV, Scalar(targetLowH, targetLowS, targetLowV), Scalar(targetHighH, targetHighS, targetHighV), imgTargetThresholded); //Threshold the image
      
  			//morphological opening (removes small objects from the foreground)
  			erode(imgTargetThresholded, imgTargetThresholded, getStructuringElement(MORPH_ELLIPSE, Size(5, 5)) );
  			dilate(imgTargetThresholded, imgTargetThresholded, getStructuringElement(MORPH_ELLIPSE, Size(5, 5)) ); 

   		//morphological closing (removes small holes from the foreground)
  			dilate(imgTargetThresholded, imgTargetThresholded, getStructuringElement(MORPH_ELLIPSE, Size(5, 5)) ); 
  			erode(imgTargetThresholded, imgTargetThresholded, getStructuringElement(MORPH_ELLIPSE, Size(5, 5)) );
  			
  			imshow("Target Threshold", imgTargetThresholded); //show the original image
  			
  			int middleX = (imgTargetThresholded.size().width)/2;
  			int middleY = (imgTargetThresholded.size().height)/2;
  			
			Mat cropTopLeft = imgTargetThresholded.clone();
			Mat cropTopRight = imgTargetThresholded.clone();
			Mat cropBotRight = imgTargetThresholded.clone();
  			
			Rect topLeftROI(0, 0, middleX, middleY);
			Rect topRightROI(middleX, 0, middleX, middleY);
			Rect botRightROI(middleX, middleY, middleX, middleY);
			
			// Crop the full image /!\ This doesn't copy the data!
			cropTopLeft = cropTopLeft(topLeftROI);
			cropTopRight = cropTopRight(topRightROI);
			cropBotRight = cropBotRight(botRightROI);
  			
  			topLeft = detectObject(cropTopLeft);
  			topRight = detectObject(cropTopRight);
  			botRight = detectObject(cropBotRight);
  			
  			//From relative position in the cropped images to position in the entire image
  			(*topRight).x += middleX;
  			(*botRight).x += middleX;
  			(*botRight).y += middleY;
  			
  			rectangle(imgOriginal, topLeftROI, Scalar(200,200,200));
  			rectangle(imgOriginal, topRightROI, Scalar(0,200,200));
  			rectangle(imgOriginal, botRightROI, Scalar(200,200,200));
		} 		 		
 		
 		
 		//Object detection
  		Mat imgThresholded;
   	inRange(imgHSV, Scalar(iLowH, iLowS, iLowV), Scalar(iHighH, iHighS, iHighV), imgThresholded); //Threshold the image
      
  		//morphological opening (removes small objects from the foreground)
  		erode(imgThresholded, imgThresholded, getStructuringElement(MORPH_ELLIPSE, Size(5, 5)) );
  		dilate(imgThresholded, imgThresholded, getStructuringElement(MORPH_ELLIPSE, Size(5, 5)) ); 

   	//morphological closing (removes small holes from the foreground)
  		dilate(imgThresholded, imgThresholded, getStructuringElement(MORPH_ELLIPSE, Size(5, 5)) ); 
  		erode(imgThresholded, imgThresholded, getStructuringElement(MORPH_ELLIPSE, Size(5, 5)) );
		
   	target = detectObject(imgThresholded);
   	/*
   	if ((*target).x >= 0 && (*target).y >= 0){
   		cross(imgOriginal, (*target).x, (*target).y, Scalar(0,0,255));
			double precisionPercentage = precisionToCenter(topLeft, topRight, botRight, target, imgOriginal);
   		cout << "X: " << (*target).x << "  -  Y: " << (*target).y << "  -  Precision: " << precisionPercentage << "%" << endl;
		}
		*/
    	
    	//Affichage sur l'image des croix sur les indicateurs de cible
    	line(imgOriginal, Point(60, 0), Point(60, 60), Scalar(0, 0, 0), 3);
    	line(imgOriginal, Point(0, 60), Point(60, 60), Scalar(0, 0, 0), 3);
    	if ( (*topLeft).x >= 0 && (*topLeft).y >= 0){
			cross(imgOriginal, (*topLeft).x, (*topLeft).y, Scalar(0, 255, 0));
			cross(imgOriginal, 20, 20, Scalar(0, 255, 0));
    	}
    	if ( (*topRight).x >= 0 && (*topRight).y >= 0){
			cross(imgOriginal, (*topRight).x, (*topRight).y, Scalar(0, 255, 0));
			cross(imgOriginal, 40, 20, Scalar(0, 255, 0));
    	}
    	if ( (*botRight).x >= 0 && (*botRight).y >= 0){
			cross(imgOriginal, (*botRight).x, (*botRight).y, Scalar(0, 255, 0));
			cross(imgOriginal, 40, 40, Scalar(0, 255, 0));
    	}
    	 if ((*target).x >= 0 && (*target).y >= 0){
			cross(imgOriginal, (*target).x, (*target).y, Scalar(0,0,255));
			cross(imgOriginal, 20, 40, Scalar(0, 0, 255));
    	}
       
   	
		/*
			int frame_since_ball_seen = 0; 	
 			int frame_to_wait_before_sending_score = 50;
 			int frame_since_score_sent = 0; 	
 			int frame_to_wait_before_ready_to_see_ball_again = 600;
		*/   	
		
		//Si les 3 indicateurs de cible et la balle sont detectes
		if ((*target).x >= 0 && (*target).y >= 0 
			&& (*topLeft).x >= 0 && (*topLeft).y >= 0
			&& (*topRight).x >= 0 && (*topRight).y >= 0
			&& (*botRight).x >= 0 && (*botRight).y >= 0	){
				
				
				if (frame_since_ball_seen < frame_to_wait_before_sending_score) {
					cout << "On attend que la balle atterisse : " << frame_since_ball_seen << "/" << frame_to_wait_before_sending_score << endl;				
					frame_since_ball_seen++;
					border(imgOriginal, 4, Scalar(255,255,255));
				
				}
				else {
					
					if (frame_since_score_sent == 0){
						cout << "On envoie le score" << endl;
						cross(imgOriginal, (*target).x, (*target).y, Scalar(0,0,255));
						double precisionPercentage = precisionToCenter(topLeft, topRight, botRight, target, imgOriginal);
						sendScore((int)(precisionPercentage), argc, argv);
						frame_since_score_sent++;
					}
					
				}
				
				
			}
			else{
				if (frame_since_ball_seen > 0 && frame_since_score_sent == 0){
					cout << "-> CIBLE PERDUE : C'ETAIT JUSTE DE LA NEIGE" << endl;
					frame_since_ball_seen = 0;
				}	
			}
			
			if (frame_since_score_sent > 0){
   			if	((frame_since_score_sent < frame_to_wait_before_ready_to_see_ball_again)){
							cout << "On a envoye le score et on attend que quelqu'un aille chercher la balle avant de recapturer : " << frame_since_score_sent << "/" << frame_to_wait_before_ready_to_see_ball_again << endl;
							frame_since_score_sent++;
							border(imgOriginal, 4, Scalar(0,0,255));
				}
				else{
							cout << "On devient de nouveau pret a detecter la balle" << endl;
							frame_since_ball_seen = 0; 	
							frame_since_score_sent = 0;
							sendScore(-1, argc, argv); 					
				}	
   		}
   	
   	
  		imshow("Original", imgOriginal); //show the original image

   	if (waitKey(15) == 27) //wait for 'esc' key press for 30ms. If 'esc' key is pressed, break loop
   	{
   		cout << "esc key is pressed by user" << endl;
      	break; 
   	}
   	
   	//wait for 'esc' key press for 30ms. If 'esc' key is pressed, break loop
   	if ( (waitKey(15) == 32) && (*topLeft).x >= 0 && (*topLeft).y >= 0 && (*topRight).x >= 0 && (*topRight).y >= 0 && (*botRight).x >= 0 && (*botRight).y >= 0)
   	{
   		cout << "space key is pressed by user" << endl;
			if (isConfirmed){
				isConfirmed = false;
			}    		
   		else{
				isConfirmed = true;   		
   		}
   	}
	}

   return 0;
   
}
