# Test Client, Heavily AI Generated

import requests
import os


def test_pdf_extraction(pdf_path):
    """
    Test the PDF extraction endpoint
    Args:
        pdf_path (str): Path to the PDF file to test
    """
    # Server endpoint
    url = 'http://localhost:5001/pdf'

    # Check if file exists
    if not os.path.exists(pdf_path):
        print(f"Error: File {pdf_path} not found")
        return

    try:
        # Open and send the PDF file
        with open(pdf_path, 'rb') as pdf_file:
            files = {'pdf_file': pdf_file}
            print("Sending request to:", url)
            print("File exists:", os.path.exists(pdf_path))
            response = requests.post(url, files=files)

        print("Response Status:", response.status_code)
        print("Response Headers:", response.headers)
        print("Full Response Content:", response.text)

        # Check response
        if response.status_code == 200:
            result = response.json()
            print("Successfully extracted text from PDF:")
            print(result['extracted_text'])
        else:
            print(f"Error: Server returned status code {response.status_code}")
            print("Response content:", response.text)
            try:
                print(response.json())
            except:
                print("Could not parse response as JSON")

    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to server. Make sure the server is running.")
    except Exception as e:
        print(f"Error occurred: {str(e)}")


def test_pptx_extraction(pptx_path):
    """
    Test the PPTX extraction endpoint
    Args:
        pptx_path (str): Path to the PPTX file to test
    """
    # Server endpoint
    url = 'http://localhost:5001/pptx'

    # Check if file exists
    if not os.path.exists(pptx_path):
        print(f"Error: File {pptx_path} not found")
        return

    try:
        # Open and send the PPTX file
        with open(pptx_path, 'rb') as pptx_file:
            files = {'pptx_file': pptx_file}
            print("Sending request to:", url)
            print("File exists:", os.path.exists(pptx_path))
            response = requests.post(url, files=files)

        print("Response Status:", response.status_code)
        print("Response Headers:", response.headers)
        print("Full Response Content:", response.text)

        # Check response
        if response.status_code == 200:
            result = response.json()
            print("Successfully extracted text from PPTX:")
            print(result['extracted_text'])
        else:
            print(f"Error: Server returned status code {response.status_code}")
            print("Response content:", response.text)
            try:
                print(response.json())
            except:
                print("Could not parse response as JSON")

    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to server. Make sure the server is running.")
    except Exception as e:
        print(f"Error occurred: {str(e)}")


if __name__ == "__main__":
    # Example usage
    pdf_path = "./pdf1.pdf"  # Update this path to your test PDF file
    pptx_path = "./pptx1.pptx"  # Update this path to your test PPTX file

    # print("Testing PDF extraction:")
    # test_pdf_extraction(pdf_path)

    print("\nTesting PPTX extraction:")
    test_pptx_extraction(pptx_path)
