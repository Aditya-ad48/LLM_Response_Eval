gunicorn -w 3 -b [::]:8080 app:app 

# Wait for all background processes to complete
wait