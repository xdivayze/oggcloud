package services

import (
	"archive/tar"
	"bufio"
	"compress/gzip"
	"fmt"
	"io"
	"log"
	"oggcloudserver/src/db"
	"oggcloudserver/src/file_ops/file"
	"os"
	"strings"

	"github.com/google/uuid"
)

func extractFile(tarReader *tar.Reader, header *tar.Header, index int, sid uuid.UUID, previewMode bool, belongsTo *file.File) error {
	fparts := strings.Split(header.Name, ".")

	outfilename := fmt.Sprintf("%s_%d.%s", fparts[0], index, fparts[1])
	outFilePath := fmt.Sprintf("%s/%s", DirectorySession, outfilename)
	outFile, err := os.Create(outFilePath)
	if err != nil {
		return fmt.Errorf("error occured while creating file at path %s:\n\t%w", outFilePath, err)
	}
	defer outFile.Close()
	bufr := bufio.NewReader(tarReader)
	bufw := bufio.NewWriter(outFile)
	if _, err = io.Copy(bufw, bufr); err != nil {
		return fmt.Errorf("error occured while writing from reader to file:\n\t%w", err)
	}
	if err = bufw.Flush(); err != nil {
		return fmt.Errorf("error occured while flushing buffered writer:\n\t%w", err)
	}
	id := uuid.New()
	fileObj := file.File{
		ID:         id,
		FileName:   outfilename,
		Size:       header.FileInfo().Size(),
		SessionID:  sid,
		HasPreview: false,
	}
	if previewMode {
		if belongsTo == nil {
			return fmt.Errorf("error: parent file object is nil")
		}
		belongsTo.PreviewID = &(fileObj.ID)
		belongsTo.Preview = &fileObj
		belongsTo.HasPreview = true
		db.DB.Save(belongsTo)

	}
	if res := db.DB.Create(&fileObj); res.Error != nil {
		return fmt.Errorf("error occured while saving to db:\n\t%w", err)
	}
	return nil
}

// TODO add concurrency back <3
func extractTarGz(r io.Reader, sid uuid.UUID, previewMode bool, belongsTo *file.File) error {

	if err := checkDirectoryValidity(r); err != nil { //ensure storage and preview directories exist and valid
		return err
	}
	

	gzipReader, err := gzip.NewReader(r)
	index := 0
	if err != nil {
		return fmt.Errorf("error occured while creating new gzip reader:\n\t%w", err)
	}
	defer gzipReader.Close()

	tarReader := tar.NewReader(gzipReader)
	for {
		header, err := tarReader.Next()
		if err == io.EOF {
			log.SetPrefix("INFO: ")
			log.Println("archive end reached")
			break
		} else if err != nil {
			return fmt.Errorf("error occured while reading the next entry in tar reader:\n\t%v", err)
		}
		index += 1
		extractFile(tarReader, header, index, sid, previewMode, belongsTo)

	}
	return nil
}
