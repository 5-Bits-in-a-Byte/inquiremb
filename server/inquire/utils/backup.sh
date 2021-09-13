BUCKET=$INQUIRE_BACKUP_BUCKET


TIMESTAMP=`date +%F-%H%M`
echo $TIMESTAMP

echo "Downloading database files at $TIMESTAMP"

mongodump --forceTableScan --uri=$MONGO_URI
FILENAME=mongodb-backup-$TIMESTAMP
mv dump $FILENAME
TARFILENAME=$FILENAME.tar.gz
tar -cvf $TARFILENAME $FILENAME

echo "Uploading backed up files to AWS S3"
/usr/local/bin/aws s3 cp $TARFILENAME s3://$BUCKET/ --storage-class STANDARD_IA
TIMESTAMP2=`date +%F-%H%M`
echo "Finished at $TIMESTAMP2"